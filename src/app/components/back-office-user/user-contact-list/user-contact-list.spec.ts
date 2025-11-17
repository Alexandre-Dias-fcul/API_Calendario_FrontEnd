import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContactList } from './user-contact-list';

describe('UserContactList', () => {
  let component: UserContactList;
  let fixture: ComponentFixture<UserContactList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserContactList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserContactList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
