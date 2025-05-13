import { TestBed } from '@angular/core/testing';

import { RegisegistrationService } from './regisegistration.service';

describe('RegisegistrationService', () => {
  let service: RegisegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
