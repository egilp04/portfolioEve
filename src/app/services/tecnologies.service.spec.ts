import { TestBed } from '@angular/core/testing';

import { TecnologiesService } from './tecnologies.service';

describe('TecnologiesService', () => {
  let service: TecnologiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TecnologiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
