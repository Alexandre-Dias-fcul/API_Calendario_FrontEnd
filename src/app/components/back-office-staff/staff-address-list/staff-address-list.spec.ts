import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAddressList } from './staff-address-list';

describe('StaffAddressList', () => {
  let component: StaffAddressList;
  let fixture: ComponentFixture<StaffAddressList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffAddressList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffAddressList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
