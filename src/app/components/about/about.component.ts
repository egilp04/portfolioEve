import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CarrouselComponent } from '../carrousel/carrousel.component';
import { Section } from '../../section.type';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CarrouselComponent, TranslateModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  @Output() navigate = new EventEmitter<Section>();
  goNextSection(section: Section, ev: Event) {
    ev.preventDefault();
    this.navigate.emit(section);
  }
}
