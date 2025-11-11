import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginUserEmployee } from './login-user-employee';

describe('LoginUserEmployee', () => {
  let component: LoginUserEmployee;
  let fixture: ComponentFixture<LoginUserEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginUserEmployee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginUserEmployee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
