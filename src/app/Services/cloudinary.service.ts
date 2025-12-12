import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {

  private cloudName = 'dr8s6kjpp';
  private uploadPreset = 'ecosoftware_unsigned';

  constructor(private http: HttpClient) {}

  subirArchivo(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/auto/upload`;

    return this.http.post(url, formData);
  }
}

