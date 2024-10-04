import { TestBed } from '@angular/core/testing';

import { ShareAddressInfoService } from './share-address-info.service';

describe('ShareAddressInfoService', () => {
  let service: ShareAddressInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareAddressInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
