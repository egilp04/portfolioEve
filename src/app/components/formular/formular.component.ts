import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { TranslateModule } from '@ngx-translate/core';

import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Section } from '../../section.type';
@Component({
  selector: 'app-formular',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './formular.component.html',
  styleUrl: './formular.component.css',
})
export class FormularComponent {
  contactForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.contactForm.valid) {
      const templateParams = {
        name: this.contactForm.value.username,
        email: this.contactForm.value.email,
        subject: this.contactForm.value.subject,
        message: this.contactForm.value.message,
      };
      console.log(templateParams);
      emailjs
        .send(
          'service_c2pii6u',
          'template_c3addk5',
          templateParams,
          'QHVmY2xHRyND2kBoT'
        )
        .then(
          (response: EmailJSResponseStatus) => {
            console.log('SUCCESS!', response.status, response.text);
            alert('Mensaje enviado correctamente 📩');
            this.contactForm.reset();
          },
          (error) => {
            console.error('FAILED...', error);
            alert('Error al enviar el mensaje, intenta de nuevo más tarde.');
          }
        );
    } else {
      console.log('Form is invalid');
    }
  }

  @Output() navigate = new EventEmitter<Section>();
  goNextSection(section: Section, ev: Event) {
    ev.preventDefault();
    this.navigate.emit(section);
  }
}
