import { TestBed } from '@angular/core/testing';

import { PersonalContactService } from './personal-contact.service';

describe('PersonalContactService', () => {
  let service: PersonalContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
