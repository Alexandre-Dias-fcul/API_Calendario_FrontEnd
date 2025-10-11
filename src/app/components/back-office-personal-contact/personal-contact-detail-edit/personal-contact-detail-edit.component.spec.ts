import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalContactDetailEditComponent } from './personal-contact-detail-edit.component';

describe('PersonalContactDetailEditComponent', () => {
  let component: PersonalContactDetailEditComponent;
  let fixture: ComponentFixture<PersonalContactDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalContactDetailEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalContactDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
