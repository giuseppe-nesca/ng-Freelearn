import { TestBed } from '@angular/core/testing';

import { PrenotationService } from './prenotation.service';

describe('PrenotationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrenotationService = TestBed.get(PrenotationService);
    expect(service).toBeTruthy();
  });
});
