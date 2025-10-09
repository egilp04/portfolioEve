import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() title!: string;
  @Input() image!: string;
  @Input() linkCode!: string;
  @Input() linkLive!: string;
  goToProject(url: string) {
    window.location.href = url;
  }
}
