import { TestBed } from '@angular/core/testing';

import { ForwardingConfigServiceService } from './forwarding-config-service.service';

describe('ForwardingConfigServiceService', () => {
  let service: ForwardingConfigServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForwardingConfigServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
