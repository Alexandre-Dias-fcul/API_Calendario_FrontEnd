import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAddress } from './staff-address';

describe('StaffAddress', () => {
  let component: StaffAddress;
  let fixture: ComponentFixture<StaffAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
