import { Component } from '@angular/core';
import { addDays, getDay, startOfISOWeek, subDays } from 'date-fns';

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

  months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  constructor() {

  }

  public getArrayOfWeek() {
    const array = [this.monday];

    for (let i = 1; i < 7; i++) {
      array.push(addDays(this.monday, i));
    }

    return array;
  }

  public increment() {
    this.arrayOfWeek = this.arrayOfWeek.map(date => addDays(date, 7))
  }

  public decrement() {
    this.arrayOfWeek = this.arrayOfWeek.map(date => subDays(date, 7));
  }
}
