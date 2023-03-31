import { TestBed } from '@angular/core/testing';

import { ValidationMessagesService } from './validation-messages.service';

describe('ValidationMessagesService', () => {
  let service: ValidationMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
