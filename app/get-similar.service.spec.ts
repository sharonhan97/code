import { TestBed } from '@angular/core/testing';

import { GetSimilarService } from './get-similar.service';

describe('GetSimilarService', () => {
  let service: GetSimilarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetSimilarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
