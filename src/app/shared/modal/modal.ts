import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css'],
})
export class Modal {
  open() {
    throw new Error('Method not implemented.');
  }

  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() headerColor: string = '#16a34a'; // Verde por defecto
  @Input() showCloseButton: boolean = true;

  @Input() cancelText: string = '';
  @Input() confirmText: string = '';
  @Input() disableConfirm: boolean = false;

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  close() {
    this.isOpen = false;
    this.closed.emit();
  }

  confirm() {
    this.isOpen = false;
    this.confirmed.emit();
  }

  closeOnBackdrop(event: Event) {
    const target = event.target as HTMLElement;

    // Si clickea fuera del modal (en el backdrop)
    if (target.classList.contains('modal')) {
      this.close();
    }
  }
}
