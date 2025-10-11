import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalContactEditComponent } from './personal-contact-edit.component';

describe('PersonalContactEditComponent', () => {
  let component: PersonalContactEditComponent;
  let fixture: ComponentFixture<PersonalContactEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalContactEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalContactEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
