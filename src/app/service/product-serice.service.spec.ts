import { TestBed } from '@angular/core/testing';

import { ProductSericeService } from './product-serice.service';

describe('ProductSericeService', () => {
  let service: ProductSericeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSericeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
