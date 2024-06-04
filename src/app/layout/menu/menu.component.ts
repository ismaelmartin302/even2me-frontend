import { Component, Renderer2, OnInit, ElementRef } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  constructor(private renderer: Renderer2, private router: Router, private el: ElementRef) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.updateActiveLink(event.urlAfterRedirects);
        }
      });

    this.updateActiveLink(this.router.url);
  }

  updateActiveLink(url: string): void {
    const links = this.el.nativeElement.querySelectorAll('.list a');

    links.forEach((link: Element) => {
      this.renderer.removeClass(link, 'link-light');
    });

    links.forEach((link: Element) => {
      const routerLink = link.getAttribute('routerLink');
      if (routerLink && url.includes(routerLink)) {
        this.renderer.addClass(link, 'link-light');
      }
    });
  }
}
