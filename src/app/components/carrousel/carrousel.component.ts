import { Component, inject, OnInit } from '@angular/core';
import { Technologies } from '../../models/Technologies';
import { TechnologiesService } from '../../services/tecnologies.service';

@Component({
  selector: 'app-carrousel',
  standalone: true,
  imports: [],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.css',
})
export class CarrouselComponent implements OnInit {
  private technologieService = inject(TechnologiesService);
  technologies: Technologies[] = [];

  ngOnInit(): void {
    this.technologieService.getTechnologies().subscribe((tech) => {
      this.technologies = [...tech];
    });
  }
}
