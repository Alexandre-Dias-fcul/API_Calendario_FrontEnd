import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalContactListComponent } from './personal-contact-list.component';

describe('PersonalContactListComponent', () => {
  let component: PersonalContactListComponent;
  let fixture: ComponentFixture<PersonalContactListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalContactListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
