import { TestBed } from '@angular/core/testing';

import { TokenmanagementService } from './tokenmanagement.service';

describe('TokenmanagementService', () => {
  let service: TokenmanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenmanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
