import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Technologies } from '../models/Technologies';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TechnologiesService {
  private dataUrl = 'assets/data/tech/technologies.json';

  constructor(private http: HttpClient) {}

  getTechnologies(): Observable<Technologies[]> {
    return this.http.get<Technologies[]>(this.dataUrl);
  }
}
