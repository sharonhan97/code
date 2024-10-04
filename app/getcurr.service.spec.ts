import { TestBed } from '@angular/core/testing';

import { GetcurrService } from './getcurr.service';

describe('GetcurrService', () => {
  let service: GetcurrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetcurrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
