import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { appointment } from '../../models/appointment';
import { participant } from '../../models/participant';
import { appointmentWithParticipants } from '../../models/appointmentWithParticipants';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  urlAppointment = `${environment.apiUrl}/Appointment`;
  constructor(private http: HttpClient) { }

  getAllAppointments(): Observable<appointment[]> {
    return this.http.get<appointment[]>(this.urlAppointment).pipe(
      catchError((error) => {
        console.error('Erro na chamada getAllAppointments', error);
        return throwError(() => new Error('Erro ao listar appointments.'));
      })
    );
  }

  getAppointmentById(id: number): Observable<appointment> {
    return this.http.get<appointment>(`${this.urlAppointment}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getAppointmentById', error);
        return throwError(() => new Error('Erro ao obter appointment'));
      })
    );
  }

  getAppointmentByIdWithParticipants(id: number): Observable<appointmentWithParticipants> {
    return this.http
      .get<appointmentWithParticipants>(`${this.urlAppointment}/GetByIdWithParticipants/${id}`).pipe(
        catchError((error) => {
          console.error('Erro na chamada getAppointmentByIdWithParticipants', error);
          return throwError(() => new Error('Erro ao obter appointment.'));
        })
      );
  }

  getAppointmentBetweenToDates(startDate: String, endDate: String): Observable<appointmentWithParticipants[]> {
    return this.http
      .get<appointmentWithParticipants[]>(`${this.urlAppointment}/GetBetweenToDates/${startDate}/${endDate}`)
      .pipe(
        catchError((error) => {
          console.error('Erro na chamada getAppointmentBetweenToDates', error);
          return throwError(() => new Error('Erro ao obter lista de appointments.'));
        })
      )
  }

  addAppointment(appointment: appointment): Observable<appointment> {
    return this.http.post<appointment>(this.urlAppointment, appointment, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada addAppointment', error);
        return throwError(() => new Error('Erro ao adicionar appointment'));
      })
    )
  }

  updateAppointment(appointment: appointment): Observable<appointment> {
    return this.http.put<appointment>(`${this.urlAppointment}/${appointment.id}`,
      appointment, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada updateAppointment', error);
        return throwError(() => new Error('Erro ao atualizar appointment'));
      })
    )
  }

  deleteAppointment(id: number): Observable<appointment> {
    return this.http.delete<appointment>(`${this.urlAppointment}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada deleteAppointment', error);
        return throwError(() => new Error('Erro ao apagar appointment.'));
      })
    )
  }

  addParticipant(idAppointment: number, idEmployee: number): Observable<participant> {
    return this.http
      .post<participant>(`${this.urlAppointment}/AddParticipant/
        ${idAppointment}/${idEmployee}`, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError((error) => {
          console.error('Erro na chamada addParticipant', error);
          return throwError(() => new Error('Erro ao adicionar appointment.'))
        })
      );
  }

  deleteParticipant(idAppointment: number, idParticipant: number): Observable<participant> {
    return this.http.delete<participant>(`${this.urlAppointment}/DeleteParticipant/
      ${idAppointment}/${idParticipant}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada  deleteParticipant', error);
        return throwError(() => new Error('Erro ao apagar participant.'))
      })
    );
  }
}
