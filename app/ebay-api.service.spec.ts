import { TestBed } from '@angular/core/testing';

import { EbayApiService } from './ebay-api.service';

describe('EbayApiService', () => {
  let service: EbayApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbayApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
