import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalContactDetailListComponent } from './personal-contact-detail-list.component';

describe('PersonalContactDetailListComponent', () => {
  let component: PersonalContactDetailListComponent;
  let fixture: ComponentFixture<PersonalContactDetailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalContactDetailListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalContactDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
