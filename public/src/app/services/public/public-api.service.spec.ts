import { TestBed } from '@angular/core/testing';

import { PublicApiService } from './public-api.service';

describe('PublicApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PublicApiService = TestBed.get(PublicApiService);
    expect(service).toBeTruthy();
  });
});
