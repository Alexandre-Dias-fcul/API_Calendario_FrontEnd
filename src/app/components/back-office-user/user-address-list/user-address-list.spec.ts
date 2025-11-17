import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddressList } from './user-address-list';

describe('UserAddressList', () => {
  let component: UserAddressList;
  let fixture: ComponentFixture<UserAddressList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAddressList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAddressList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
