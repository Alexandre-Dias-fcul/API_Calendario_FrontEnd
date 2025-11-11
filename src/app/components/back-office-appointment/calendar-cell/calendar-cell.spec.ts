import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCell } from './calendar-cell';

describe('CalendarCell', () => {
  let component: CalendarCell;
  let fixture: ComponentFixture<CalendarCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
