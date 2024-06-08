import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
 biography: string = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem ipsam, expedita repellendus, repudiandae labore veniam neque sit quam voluptatum reprehenderit corporis ducimus inventore doloremque dolorum maiores architecto accusantium! Delectus, repudiandae?"
isExpanded: boolean = false;
constructor(private sanitizer: DomSanitizer) {}
getBiography(): SafeHtml {
  if (this.isExpanded) {
    return this.sanitizer.bypassSecurityTrustHtml(this.biography);
  } else {
    return this.sanitizer.bypassSecurityTrustHtml(this.limitar_Caracteres(this.biography));
  }
}
limitar_Caracteres(texto: string): string {
  if (texto.length >= 200) {
    return texto.substring(0, 200) + '... <span class="text-secondary clickable"> [Mostrar Más] </span>';
  } else {
    return texto;
  }
}
 mostrar_Mas(texto:string) {
  return texto + "2313123";
 }
 toggleExpand() {
  this.isExpanded = !this.isExpanded;
}
}
