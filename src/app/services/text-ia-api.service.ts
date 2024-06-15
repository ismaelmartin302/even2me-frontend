import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextIaApiService {

  private readonly url = 'https://api.textcortex.com/v1/texts/completions';
  httpClient = inject(HttpClient)
  constructor() { }
  getText(titulo: string) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer gAAAAABmbaZk6-0dc2PiPmjN-zfxGBMS16Kivp80YdDpp0y_jJZAGMRyV58PW7d7-M7JBtUvCvsWaGpoYKebGLy0cZn5ELz-kPhNsVN2Bu_Iltu5N2hZspYVAQT61Cul91KP-qSTsGSk',
      'Content-Type': 'application/json'
    });

    const body = {
      "formality": "default",
      "max_tokens": 2048,
      "model": "claude-haiku",
      "n": 1,
      "source_lang": "es",
      "target_lang": "es",
      "temperature": null,
      "text": `Creame una descripcion llamativa para un evento cuyo titulo es: ${titulo}. Devuelveme directamente el texto, sin ningun titulo ni nada`
    };

    return this.httpClient.post(this.url, body, { headers });
  }
}
