import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalContactNewComponent } from './personal-contact-new.component';

describe('PersonalContactNewComponent', () => {
  let component: PersonalContactNewComponent;
  let fixture: ComponentFixture<PersonalContactNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalContactNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalContactNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
