import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { appointment } from '../../../models/appointment';
import { appointmentWithParticipants } from '../../../models/appointmentWithParticipants';

@Component({
  selector: 'app-calendar-cell',
  imports: [CommonModule],
  templateUrl: './calendar-cell.html',
  styleUrl: './calendar-cell.css'
})
export class CalendarCell {

  @Input() positionTop: number | null = null;
  @Input() positionLeft: number | null = null;
  @Input() appointments: appointmentWithParticipants[] = [];
}
