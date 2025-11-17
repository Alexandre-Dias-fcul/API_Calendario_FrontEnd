import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddress } from './user-address';

describe('UserAddress', () => {
  let component: UserAddress;
  let fixture: ComponentFixture<UserAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
