import { Component, signal, effect } from '@angular/core';
import { IntroComponent } from './components/intro/intro.component';
import { FormularComponent } from './components/formular/formular.component';
import { AboutComponent } from './components/about/about.component';
import { MenuComponent } from './components/menu/menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectsComponent } from './components/projects/projects.component';
import { Section } from './section.type';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormularComponent,
    IntroComponent,
    AboutComponent,
    MenuComponent,
    ReactiveFormsModule,
    ProjectsComponent,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'miPortfolio';
  current = signal<Section>('home');

  showSection(section: Section) {
    this.current.set(section as any);
    console.log(this.current);
  }
}
