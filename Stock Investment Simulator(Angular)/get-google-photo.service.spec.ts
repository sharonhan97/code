import { TestBed } from '@angular/core/testing';

import { GetGooglePhotoService } from './get-google-photo.service';

describe('GetGooglePhotoService', () => {
  let service: GetGooglePhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetGooglePhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
