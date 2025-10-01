import { Component, EventEmitter, Output } from '@angular/core';
import { Section } from '../../section.type';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css',
})
export class IntroComponent {
  @Output() navigate = new EventEmitter<Section>();
  goNextSection(section: Section, ev: Event) {
    ev.preventDefault();
    this.navigate.emit(section);
  }
}
