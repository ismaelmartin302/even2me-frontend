import { TestBed } from '@angular/core/testing';

import { TextIaApiService } from './text-ia-api.service';

describe('TextIaApiService', () => {
  let service: TextIaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextIaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
