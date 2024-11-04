import { TestBed } from '@angular/core/testing';

import { LayersApiService } from './layers-api.service';

describe('LayersApiService', () => {
  let service: LayersApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayersApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
