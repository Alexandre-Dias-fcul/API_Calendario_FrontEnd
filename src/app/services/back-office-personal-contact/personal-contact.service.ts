import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { personalContact } from '../../models/personalContact';
import { personalContactWithDetail } from '../../models/personalContactWithDetail';
import { personalContactDetail } from '../../models/personalContactDetail';
import { pagination } from '../../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class PersonalContactService {

  urlPersonalContact = `${environment.apiUrl}/PersonalContact`;

  constructor(private http: HttpClient) { }

  getAllPersonalContacts(): Observable<personalContact[]> {
    return this.http.get<personalContact[]>(this.urlPersonalContact).pipe
      (
        catchError((error) => {
          console.error('Erro na chamada getAllPersonalContacts', error);
          return throwError(() => new Error('Erro ao listar personal contacts.'));
        })
      );
  }

  getPersonalContactPaginationByEmployeeId(employeeId: number, pageNumber: number, pageSize: number,
    search: string): Observable<pagination<personalContact>> {
    return this.http.get<pagination<personalContact>>
      (`${this.urlPersonalContact}/GetPersonalContactPaginationByEmployeeId/${employeeId}/${pageNumber}/${pageSize}?search=${search}`)
      .pipe(
        catchError((error) => {
          console.error('Erro na chamada getPersonalContactPaginationByEmployeeId:', error);
          return throwError(() => Error('Erro ao obter lista paginada de personal contacts.'));
        })
      );
  }

  getPersonalContactById(id: number): Observable<personalContact> {
    return this.http.get<personalContact>(`${this.urlPersonalContact}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getPersonalContactById', error);
        return throwError(() => new Error('Erro ao obter personal contact'));
      })
    );
  }

  getPersonalContactWithDetail(id: number): Observable<personalContactWithDetail> {
    return this.http
      .get<personalContactWithDetail>(`${this.urlPersonalContact}/GetByIdWithDetail/${id}`).pipe(
        catchError((error) => {
          console.error('Erro na chamada getPersonalContactWithDetail', error);
          return throwError(() => new Error('Erro ao obter personal contact.'));
        })
      );
  }

  addPersonalContact(personalContact: personalContact): Observable<personalContact> {
    return this.http.post<personalContact>(this.urlPersonalContact, personalContact, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada addPersonalContact', error);
        return throwError(() => new Error('Erro ao adicionar personal contact'));
      })
    )
  }

  updatePersonalContact(personalContact: personalContact): Observable<personalContact> {
    return this.http.put<personalContact>(`${this.urlPersonalContact}/${personalContact.id}`,
      personalContact, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada updatePersonalContact', error);
        return throwError(() => new Error('Erro ao atualizar personal contact'));
      })
    )
  }

  deletePersonalContact(id: number): Observable<personalContact> {
    return this.http.delete<personalContact>(`${this.urlPersonalContact}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada deletePersonalContactBuId', error);
        return throwError(() => new Error('Erro ao deletar personal contact'));
      })
    );
  }

  addDetail(idPersonalContact: number, personalContactDetail: personalContactDetail): Observable<personalContactDetail> {
    return this.http.post<personalContactDetail>(`${this.urlPersonalContact}/AddDetail/${idPersonalContact}`, personalContactDetail,
      {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError((error) => {
          console.error('Erro na chamada addDetail', error);
          return throwError(() => new Error('Erro ao adicionar detalhe do personal contact'));
        })
      )
  }

  updateDetail(idPersonalContact: number, personalContactDetail: personalContactDetail): Observable<personalContactDetail> {
    return this.http.put<personalContactDetail>(`${this.urlPersonalContact}/UpdateDetail/${idPersonalContact}/${personalContactDetail.id}`
      , personalContactDetail, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada updateDetail', error);
        return throwError(() => new Error('Erro ao atualizar detalhe do personal contact'));
      })
    )
  }

  deleteDetail(idPersonalContact: number, idPersonalContactDetail: number): Observable<personalContactDetail> {
    return this.http
      .delete<personalContactDetail>(`${this.urlPersonalContact}/DeleteDetail/${idPersonalContact}/${idPersonalContactDetail}`)
      .pipe(
        catchError((error) => {
          console.error('Erro na chamada deleteDetail', error);
          return throwError(() => new Error('Erro ao deletar detalhe do personal contact'));
        })
      );
  }
}
