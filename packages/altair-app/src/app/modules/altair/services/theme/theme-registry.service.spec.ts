import { TestBed } from '@angular/core/testing';

import { ThemeRegistryService } from './theme-registry.service';

describe('ThemeRegistryService', () => {
  let service: ThemeRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } });
    service = TestBed.inject(ThemeRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
