import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffContactList } from './staff-contact-list';

describe('StaffContactList', () => {
  let component: StaffContactList;
  let fixture: ComponentFixture<StaffContactList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffContactList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffContactList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
