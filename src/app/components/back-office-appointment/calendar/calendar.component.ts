import { Component } from '@angular/core';
import { addDays, getDay, startOfISOWeek, subDays } from 'date-fns';
import { appointment } from '../../../models/appointment';
import { appointmentWithParticipants } from '../../../models/appointmentWithParticipants';
import { AppointmentService } from '../../../services/back-office-appointment/appointment.service';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {

  currentDate: Date = new Date();

  monday: Date = startOfISOWeek(this.currentDate);

  arrayOfWeek = this.getArrayOfWeek();

  days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  hours = this.getHours();

  appointments: appointmentWithParticipants[] = [];

  calendar = this.getCalendar();

  errorMessage: string | null = null;

  id: number;

  constructor(private appointmentService: AppointmentService,
    private authorization: AuthorizationService,
    private router: Router) {

    const role = this.authorization.getRole();

    this.id = Number(this.authorization.getId());

    if (!role || (role !== 'Staff' && role !== 'Agent' && role !== 'Manager'
      && role !== 'Broker' && role !== 'Admin') || !this.id) {

      this.router.navigate(['/front-page', 'login']);

      return;
    }

    this.getBetweenToDates(this.arrayOfWeek[0].toISOString(), this.arrayOfWeek[6].toISOString());
  }

  getBetweenToDates(startDate: string, endDate: string) {
    this.appointmentService.getAppointmentBetweenToDates(startDate, endDate).subscribe({

      next: (response) => {
        this.appointments = response;
        this.fillCalendar();
      },
      error: (error) => {
        console.error('Erro ao obter lista de appointments:', error);
        this.errorMessage = error;
      }
    });
  }

  public getArrayOfWeek() {
    const array = [this.monday];

    for (let i = 1; i < 7; i++) {
      array.push(addDays(this.monday, i));
    }

    return array;
  }

  public getCalendar() {
    const array: appointment[][] = [];

    const appointment: appointment =
    {
      id: 0,
      title: '',
      description: '',
      date: new Date(),
      hourStart: '',
      hourEnd: '',
      status: 0
    }
    for (let i = 0; i < 7; i++) {
      array[i] = [];
      for (let j = 0; j < 24; j++) {
        array[i][j] = appointment;
      }
    }

    return array;
  }

  public fillCalendar() {

    this.appointments = this.appointments.filter((appointment) =>
      (appointment.participants.find(participant => (participant.employeeId === this.id))));

    this.calendar = this.getCalendar();

    this.appointments.forEach((appointment) => {

      this.calendar[getDay(appointment.date)][Number(appointment.hourStart.substring(0, 2))] = appointment;

    });
  }

  public getHours() {
    const array = [];

    for (let i = 0; i < 24; i++) {
      array.push(i);
    }

    return array;
  }

  public increment() {

    this.arrayOfWeek = this.arrayOfWeek.map(date => addDays(date, 7));

    this.getBetweenToDates(this.arrayOfWeek[0].toISOString(), this.arrayOfWeek[6].toISOString());

  }

  public decrement() {
    this.arrayOfWeek = this.arrayOfWeek.map(date => subDays(date, 7));

    this.getBetweenToDates(this.arrayOfWeek[0].toISOString(), this.arrayOfWeek[6].toISOString());
  }
}
