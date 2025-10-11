import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalContactDetailNewComponent } from './personal-contact-detail-new.component';

describe('PersonalContactDetailNewComponent', () => {
  let component: PersonalContactDetailNewComponent;
  let fixture: ComponentFixture<PersonalContactDetailNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalContactDetailNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalContactDetailNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
