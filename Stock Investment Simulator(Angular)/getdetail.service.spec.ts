import { TestBed } from '@angular/core/testing';

import { GetdetailService } from './getdetail.service';

describe('GetdetailService', () => {
  let service: GetdetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetdetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
