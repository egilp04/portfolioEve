import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CardsService } from '../../services/card.service';
import { Card } from '../../models/Card';
import { Section } from '../../section.type';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CardComponent, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  cards: Card[] = [];
  private cardsService = inject(CardsService);
  ngOnInit(): void {
    this.cardsService.getCards().subscribe((card: Card[]) => {
      this.cards = [...card];
    });
  }
  @Output() navigate = new EventEmitter<Section>();
  goNextSection(section: Section, ev: Event) {
    ev.preventDefault();
    this.navigate.emit(section);
  }
}
