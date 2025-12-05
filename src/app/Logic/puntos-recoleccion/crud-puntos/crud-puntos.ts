import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PuntosService } from '../../../Services/puntos-reciclaje.service';
import { PuntoReciclaje } from '../../../Models/puntos-reciclaje.model';
import { UsuarioService } from '../../../Services/usuario.service';
import { UsuarioModel } from '../../../Models/usuario';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-crud-puntos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud-puntos.html',
  styleUrls: ['./crud-puntos.css']
})
export class CrudPuntos implements OnInit {
  puntos: PuntoReciclaje[] = [];
  loading = false;
  error = '';

  showModal = false;
  isEditing = false;
  // view modal
  showViewModal = false;
  viewItem: any = null;
  // normalized view model used by the read-only modal
  viewModel: any = null;
  viewHeaderClass = '';
  viewTipoClass = '';
  // optional mapping from numeric tipo IDs to names (adjust to your backend values)
  tipoResiduoMap: Record<string,string> = {
    '1': 'Papel',
    '2': 'Metal',
    '3': 'Plastico',
    '4': 'Vidrio'
  };

  /**
   * Normalize different representations of tipo_residuo into a display string.
   * Accepts: string, number (id), object { nombre|name }, array, etc.
   */
  resolveTipoText(raw: any): string {
    if (raw === null || raw === undefined) return '';
    // if it's an array, try the first element
    if (Array.isArray(raw)) raw = raw[0];
    // if it's an object, try common fields
    if (typeof raw === 'object') {
      const o = raw as any;
      const cand = o.nombre ?? o.name ?? o.tipo ?? o.label ?? o.descripcion ?? o.title ?? null;
      if (cand) return String(cand);
      // fallback to JSON string
      try { return JSON.stringify(o); } catch { return String(o); }
    }
    // if it's numeric id, map if possible
    const maybeNum = Number(raw);
    if (!isNaN(maybeNum) && String(raw).trim() !== '') {
      const mapped = this.tipoResiduoMap[String(raw)];
      return mapped ?? `ID:${raw}`;
    }
    return String(raw);
  }

  /**
   * Heuristically find a field that likely contains the tipo_residuo in an object.
   * Scans own properties and one level deep for keys containing keywords.
   */
  findTipoValue(obj: any, depth = 0): any {
    if (!obj || typeof obj !== 'object') return null;
    const keys = Object.keys(obj);
    const keywords = ['resid', 'tipo', 'categoria', 'material', 'clase'];
    // first pass: direct keys containing keywords
    for (const k of keys) {
      const lk = k.toLowerCase();
      if (keywords.some(kw => lk.includes(kw))) return obj[k];
    }
    // second pass: if nested objects, search one level deep
    if (depth < 2) {
      for (const k of keys) {
        const val = obj[k];
        if (val && typeof val === 'object') {
          const found = this.findTipoValue(val, depth + 1);
          if (found !== null && found !== undefined) return found;
        }
      }
    }
    return null;
  }
  // normalized JSON to display (matching PuntoReciclaje)
  viewItemNormalized: any = null;
  showJson = false;
  form: any = {
    id: null,
    nombre: '',
    direccion: '',
    direccion_full: '',
    horario: '',
    tipo_residuo: '',
    descripcion: '',
    latitud: null,
    longitud: null
  };

  // (inline form removed) cards are shown in compact mode; modal used for create/edit

  currentUserId: number | null = null;
  currentUserRoleId: number | null = null;
  @Input() compact: boolean = false;

  // compact mode helpers
  showListModal: boolean = false;
  filteredPuntos: PuntoReciclaje[] = [];
  // Two-section display (non-admin)
  misPuntos: PuntoReciclaje[] = [];
  todosPuntos: PuntoReciclaje[] = [];
  // geocoding
  geocodeResults: any[] = [];
  private _geocodeTimer: any = null;

  constructor(private puntosService: PuntosService, private usuarioService: UsuarioService, private authService: AuthService) {}

  ngOnInit(): void {
    // obtener usuario actual para permisos
    this.refreshUser();

    this.load();
  }

  load(): void {
    // refresh user info each time we load data (handles navigation/view changes)
    this.refreshUser();
    this.loading = true;
    this.puntosService.obtenerTodos().subscribe({
      next: res => {
        const data = Array.isArray(res) ? res : res.data;
        const mapped = (data || []).map((p: any) => {
          const item = {
            ...p,
            latitud: p.latitud !== null && p.latitud !== undefined ? parseFloat(String(p.latitud)) : (p.lat ? parseFloat(p.lat) : null),
            longitud: p.longitud !== null && p.longitud !== undefined ? parseFloat(String(p.longitud)) : (p.lon ? parseFloat(p.lon) : null),
            usuario_id: p.usuario_id ?? p.usuarioId ?? p.user_id ?? null
          } as any;

          // normalize direccion: prefer 'ubicacion' from backend as canonical address
          item.direccion = item.ubicacion ?? item.direccion ?? item.address ?? item.direccion_completa ?? item.location ?? item.ubicacion_text ?? '';
          // keep full address and provide a shortened display version
          item.direccion_full = p.direccion_full ?? p.display_name ?? item.direccion;
          item.direccion = this.formatAddress(item.direccion_full ?? item.direccion);

          // normalize descripcion from 'otro' if present
          item.descripcion = item.otro ?? item.descripcion ?? item.description ?? '';

          // normalize tipo_residuo: try common keys and map numeric ids to names if mapping exists
          let rawTipo = item.tipo_de_residuo ?? item.tipo_residuo ?? item.tipoResiduo ?? item.residuo ?? item.tipo ?? item.tipo_res ?? item.tipoResiduoId ?? item.tipo_id ?? item.tipo_obj ?? null;
          // if not found in top-level keys, attempt heuristic search inside the object
          if (rawTipo === null || rawTipo === undefined || String(rawTipo).trim() === '') {
            const found = this.findTipoValue(item);
            rawTipo = found ?? rawTipo;
          }
          item.tipo_residuo = this.resolveTipoText(rawTipo);

          return item as PuntoReciclaje;
        });
        // Always load all puntos; display will organize them
        const allPoints: PuntoReciclaje[] = mapped;
        this.puntos = allPoints;
        // Populate two-section lists for non-admin users
        if (this.isAdmin()) {
          this.misPuntos = [];
          this.todosPuntos = [];
        } else {
          this.misPuntos = allPoints.filter(p => p.usuario_id === this.currentUserId);
          this.todosPuntos = allPoints.filter(p => p.usuario_id !== this.currentUserId);
        }
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Error al cargar puntos';
        this.loading = false;
      }
    });
  }

  openCreate(): void {
    this.isEditing = false;
    this.form = { id: null, nombre: '', direccion: '', direccion_full: '', horario: '', tipo_residuo: '', descripcion: '', latitud: null, longitud: null };
    this.showModal = true;
  }

  openEdit(p: PuntoReciclaje): void {
    this.isEditing = true;
    this.form = { ...p };
    this.showModal = true;
  }

  save(): void {
    if (!this.form.nombre) { this.error = 'El nombre es obligatorio'; return; }

    const payload = {
      nombre: this.form.nombre,
      direccion: this.form.direccion_full ?? this.form.direccion,
      horario: this.form.horario,
      tipo_residuo: this.form.tipo_residuo,
      descripcion: this.form.descripcion,
      latitud: this.form.latitud,
      longitud: this.form.longitud,
      usuario_id: this.form.usuario_id ?? this.currentUserId
    };

    if (this.isEditing && this.form.id) {
      this.puntosService.actualizar(this.form.id, payload).subscribe({
        next: () => { this.showModal = false; this.load(); },
        error: err => { console.error(err); this.error = 'Error actualizando'; }
      });
    } else {
      this.puntosService.crear(payload).subscribe({
        next: () => { this.showModal = false; this.load(); },
        error: err => { console.error(err); this.error = 'Error creando'; }
      });
    }
  }

  remove(p: PuntoReciclaje): void {
    if (!this.isAdmin()) { this.error = 'No tienes permiso para eliminar'; return; }
    if (!confirm(`Eliminar punto "${p.nombre}"?`)) return;
    this.puntosService.eliminar(p.id).subscribe({
      next: () => this.load(),
      error: err => { console.error(err); this.error = 'Error eliminando'; }
    });
  }

  /** Check if current user can edit a punto (owns it or is admin) */
  canEdit(p: PuntoReciclaje): boolean {
    if (this.isAdmin()) return true;
    return p.usuario_id === this.currentUserId;
  }

  /** Check if current user can delete a punto (owns it or is admin) */
  canDelete(p: PuntoReciclaje): boolean {
    if (this.isAdmin()) return true;
    return p.usuario_id === this.currentUserId;
  }

  isAdmin(): boolean {
    // roleId 1 => administrador (convention used elsewhere)
    if (this.currentUserRoleId === 1) return true;
    const usr = this.usuarioService.obtenerUsuarioActual();
    if (usr && usr.rol === 'Administrador') return true;
    const au: any = this.authService.getUser();
    const inner = au ? (au.usuario ?? au) : null;
    if (inner) {
      if (inner.rol === 'Administrador') return true;
      const rid = inner.rolId ?? inner.rol_id ?? null;
      if (rid === 1) return true;
    }
    return false;
  }

  /**
   * Refresh current user id and role from available services/localStorage.
   */
  refreshUser(): void {
    const u: UsuarioModel | null = this.usuarioService.obtenerUsuarioActual();
    if (u) {
      this.currentUserId = (u.idUsuario ?? (u as any).id) as number | null;
      this.currentUserRoleId = u.rolId ?? (u as any).rolId ?? null;
      return;
    }
    const au: any = this.authService.getUser();
    if (au) {
      const inner = au.usuario ?? au;
      this.currentUserId = inner.id ?? inner.idUsuario ?? inner.usuarioId ?? null;
      this.currentUserRoleId = inner.rolId ?? inner.rol_id ?? null;
      if (!this.currentUserRoleId && typeof inner.rol === 'string') {
        this.currentUserRoleId = inner.rol === 'Administrador' ? 1 : null;
      }
    }
  }

  closeModal(): void { this.showModal = false; this.error = ''; }

  view(p: PuntoReciclaje): void {
    this.viewItem = { ...p };
    // prepare normalized object matching PuntoReciclaje interface
    this.viewItemNormalized = this.normalizeToModel(p);
    this.showJson = false;
    // normalize fields into viewModel so template uses consistent keys
    const t: any = p || {};
    this.viewModel = {
      nombre: t.nombre ?? t.name ?? t.titulo ?? '-',
      direccion: t.direccion ?? t.address ?? t.ubicacion ?? '-',
      latitud: t.latitud ?? t.lat ?? t.latitude ?? null,
      longitud: t.longitud ?? t.lon ?? t.longitude ?? null,
      horario: t.horario ?? t.schedule ?? '-',
      tipo_residuo_raw: t.tipo_residuo ?? t.tipoResiduo ?? t.residuo ?? t.tipo ?? t.tipo_res ?? t.tipoResiduoId ?? t.tipo_id ?? t.tipo_obj ?? null,
      tipo_residuo: null,
      descripcion: t.descripcion ?? t.description ?? '-',
      usuario: t.usuario ?? t.usuario_id ?? t.usuarioId ?? t.user ?? null,
      imagen: t.imagen ?? t.image ?? null
    };
    // Decide display and classes for tipo_residuo
    const rawTipo = this.viewModel.tipo_residuo_raw;
    this.viewModel.tipo_residuo = this.resolveTipoText(rawTipo) || '-';
    // determine color class from resolved text
    this.viewTipoClass = this.tipoClassFor(this.viewModel.tipo_residuo || '');
    // header color: reuse previous bg mapping (prefer bg if matched)
    if (this.viewTipoClass === 'papel-color') this.viewHeaderClass = 'bg-papel';
    else if (this.viewTipoClass === 'plastico-color') this.viewHeaderClass = 'bg-plastico';
    else if (this.viewTipoClass === 'vidrio-color') this.viewHeaderClass = 'bg-vidrio';
    else this.viewHeaderClass = 'bg-default';

    this.showViewModal = true;
  }

  /** Build an object matching the PuntoReciclaje interface from arbitrary input */
  normalizeToModel(src: any) {
    const s: any = src || {};
    const direccionFull = s.ubicacion ?? s.direccion_full ?? s.display_name ?? s.direccion ?? '';
    const tipoRaw = s.tipo_de_residuo ?? s.tipo_residuo ?? s.tipoResiduo ?? s.residuo ?? s.tipo ?? s.tipo_res ?? s.tipoResiduoId ?? s.tipo_id ?? null;
    return {
      id: Number(s.id) || 0,
      nombre: s.nombre ?? s.name ?? s.titulo ?? '',
      direccion: direccionFull ? String(direccionFull) : '',
      horario: s.horario ?? s.schedule ?? '',
      tipo_residuo: this.resolveTipoText(tipoRaw) || '',
      descripcion: s.otro ?? s.descripcion ?? s.description ?? '',
      latitud: s.latitud ?? s.lat ?? s.latitude ?? null,
      longitud: s.longitud ?? s.lon ?? s.longitude ?? null,
      imagen: s.imagen ?? s.image ?? null,
      usuario_id: s.usuario_id ?? s.usuarioId ?? s.user ?? null
    } as PuntoReciclaje;
  }

  closeViewModal(): void { this.showViewModal = false; this.viewItem = null; }

  openMyPoints(): void {
    if (!this.currentUserId) { this.error = 'Debes iniciar sesión para ver tus puntos'; return; }
    this.filteredPuntos = this.puntos.filter(p => p.usuario_id === this.currentUserId);
    this.showListModal = true;
  }

  closeListModal(): void { this.showListModal = false; }

  /**
   * Return CSS class for a given tipo_residuo text (reuses same mapping rules)
   */
  tipoClassFor(tipo: string | null | undefined): string {
    if (!tipo) return '';
    const lower = String(tipo).toLowerCase();
    if (/papel|carton/.test(lower)) return 'papel-color';
    if (/metal/.test(lower)) return 'metal-color';
    if (/plast|plástico|plastico/.test(lower)) return 'plastico-color';
    if (/vidr|vidrio/.test(lower)) return 'vidrio-color';
    return '';
  }

  /**
   * Return background class name to apply to a card/header based on tipo text
   */
  bgClassFor(tipo: string | null | undefined): string {
    if (!tipo) return 'bg-default';
    const lower = String(tipo).toLowerCase();
    if (/papel|carton/.test(lower)) return 'bg-papel';
    if (/metal/.test(lower)) return 'bg-metal';
    if (/plast|plástico|plastico/.test(lower)) return 'bg-plastico';
    if (/vidr|vidrio/.test(lower)) return 'bg-vidrio';
    if (/org|organico|orgánico/.test(lower)) return 'bg-organico';
    return 'bg-default';
  }

  // Geocode address using Nominatim (OpenStreetMap)
  searchAddress(query: string) {
    this.geocodeResults = [];
    if (!query || query.length < 3) return;
    if (this._geocodeTimer) clearTimeout(this._geocodeTimer);
    this._geocodeTimer = setTimeout(async () => {
      try {
        // Restrict search to Bogotá, Colombia using viewbox + bounded=1
        // Bogotá approximate bbox: lon_min, lat_max, lon_max, lat_min
        const lonMin = -74.145; const latMax = 4.85; const lonMax = -73.87; const latMin = 4.498;
        const viewbox = `${lonMin},${latMax},${lonMax},${latMin}`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=8&addressdetails=1&countrycodes=co&viewbox=${viewbox}&bounded=1&q=${encodeURIComponent(query)}`;
        const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });
        const data = await res.json();
        this.geocodeResults = Array.isArray(data) ? data : [];
      } catch (e) {
        console.error('Geocoding error', e);
      }
    }, 300);
  }

  selectAddress(item: any) {
    if (!item) return;
    // store full address separately for saving and a shortened version for UI
    this.form.direccion_full = item.display_name || item.name || '';
    this.form.direccion = this.formatAddress(this.form.direccion_full);
    this.form.latitud = item.lat ? parseFloat(item.lat) : null;
    this.form.longitud = item.lon ? parseFloat(item.lon) : null;
    this.geocodeResults = [];
  }

  formatAddress(full: string | null | undefined): string {
    if (!full) return '';
    // remove country suffixes like ", Colombia"
    let s = String(full).replace(/,?\s*Colombia\.?$/i, '');
    // keep first 3 comma-separated parts
    const parts = s.split(',').map(p => p.trim()).filter(Boolean);
    const short = parts.slice(0, 3).join(', ');
    if (short.length <= 60) return short;
    return short.slice(0, 57) + '...';
  }

  isFormValid(): boolean {
    return !!(this.form.nombre && this.form.direccion && this.form.latitud != null && this.form.longitud != null);
  }
}
