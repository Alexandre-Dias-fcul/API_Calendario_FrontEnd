import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffContact } from './staff-contact';

describe('StaffContact', () => {
  let component: StaffContact;
  let fixture: ComponentFixture<StaffContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffContact]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffContact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
