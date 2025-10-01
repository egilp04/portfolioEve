import { Component, EventEmitter, Output } from '@angular/core';
import { Section } from '../../section.type';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  visibleMenu = false;
  @Output() navigate = new EventEmitter<Section>();

  constructor(private translate: TranslateService) {}

  goToSection(section: Section, ev: Event) {
    ev.preventDefault();
    this.navigate.emit(section);
  }
  toggleMenu() {
    this.visibleMenu = !this.visibleMenu;
  }

  setLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }
}
