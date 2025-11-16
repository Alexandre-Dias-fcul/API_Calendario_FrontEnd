import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { staff } from '../../models/staff';
import { account } from '../../models/account';
import { address } from '../../models/address';
import { contact } from '../../models/contact';
import { catchError, Observable, throwError } from 'rxjs';
import { staffAll } from '../../models/staffAll';
import { staffParticipant } from '../../models/staffParticipant';
import { environment } from '../../environments/environment';
import { staffPersonalContact } from '../../models/staffPersonalContact';
import { pagination } from '../../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class StaffService {


  urlStaff: string = `${environment.apiUrl}/Staff`;

  constructor(private http: HttpClient) {

  }

  getAllStaff(): Observable<staff[]> {
    return this.http.get<staff[]>(this.urlStaff).pipe(
      catchError((error) => {
        console.error('Erro na chamada getAllStaff:', error);
        return throwError(() => new Error('Erro ao listar staff.'));
      })
    );
  }

  getAllStaffPagination(pageNumber: number, pageSize: number, search: string): Observable<pagination<staff>> {
    return this.http.get<pagination<staff>>(`${this.urlStaff}/GetAllPagination/${pageNumber}/${pageSize}?search=${search}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getGetAllPagination:', error);
        return throwError(() => Error('Erro ao obter lista paginada de staff.'));
      })
    );
  }

  getStaffById(id: number): Observable<staff> {
    return this.http.get<staff>(`${this.urlStaff}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getStaffById:', error);
        return throwError(() => new Error('Erro ao obter staff.'));
      })
    );

  }

  getStaffByEmail(email: string): Observable<staff> {
    return this.http.get<staff>(`${this.urlStaff}/GetByEmail?email=${email}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getStaffByEmail:', error);
        return throwError(() => new Error('Erro ao obter staff.'));
      })
    );
  }

  getByIdWithAll(id: number): Observable<staffAll> {
    return this.http.get<staffAll>(` ${this.urlStaff}/GetByIdWithAll/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getByIdWithAll:', error);
        return throwError(() => new Error('Erro ao obter staff.'));
      })
    );
  }

  getByIdWithParticipants(id: number): Observable<staffParticipant> {
    return this.http.get<staffParticipant>(`${this.urlStaff}/GetByIdWithParticipants/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada  getByIdWithParticipants:', error);
        return throwError(() => new Error('Erro ao obter staff.'));
      })
    );
  }

  getByIdWithPersonalContacts(id: number): Observable<staffPersonalContact> {
    return this.http.get<staffPersonalContact>(`${this.urlStaff}/GetByIdWithPersonalContacs/${id}`).pipe(
      catchError((error) => {

        console.error('Erro na chamada getByIdWithPersonalContacs:', error);

        return throwError(() => Error('Erro ao obter staff com personal contacts.'))
      })
    )
  }

  addStaff(staff: staff): Observable<staff> {
    return this.http.post<staff>(this.urlStaff, staff,
      { headers: { 'Content-Type': 'application/json' } }).pipe(
        catchError((error) => {
          console.error('Erro na chamada addStaff:', error);
          return throwError(() => new Error('Erro ao adicionar staff.'));
        })
      )
  }

  updateStaff(staff: staff): Observable<staff> {
    return this.http.put<staff>(`${this.urlStaff}/${staff.id}`, staff,
      { headers: { 'Content-Type': 'application/json' } }).pipe(
        catchError((error) => {
          console.error('Erro na chamada updateStaff:', error);
          return throwError(() => new Error('Erro ao atualizar staff.'));
        })
      );
  }

  deleteStaff(id: number): Observable<staff> {
    return this.http.delete<staff>(`${this.urlStaff}/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Erro na chamada deleteStaff:', error);
          return throwError(() => new Error('Erro ao excluir staff.'));
        })
      );
  }

  staffAddAccount(account: account, staffId: number): Observable<account> {
    return this.http.post<account>(`${this.urlStaff}/AddAccount/${staffId}`, account,
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      catchError((error) => {
        console.error('Erro na chamada staffAddAccount:', error);
        return throwError(() => new Error('Erro ao adicionar conta ao staff.'));
      })
    );
  }

  staffAddAddress(address: address, staffId: number): Observable<address> {
    return this.http.post<address>(`${this.urlStaff}/AddAddress/${staffId}`, address,
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      catchError((error) => {
        console.error('Erro na chamada staffAddAddress:', error);
        return throwError(() => new Error('Erro ao adicionar endereço ao staff.'));
      })
    );
  }

  staffAddContact(contact: contact, staffId: number): Observable<contact> {
    return this.http.post<contact>(`${this.urlStaff}/AddContact/${staffId}`, contact,
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      catchError((error) => {
        console.error('Erro na chamada staffAddContact:', error);
        return throwError(() => new Error('Erro ao adicionar contato ao staff.'));
      })
    );
  }

  staffUpdateAccount(account: account, staffId: number): Observable<account> {
    return this.http.put<account>(`${this.urlStaff}/UpdateAccount/${staffId}`,
      account, { headers: { 'Content-Type': 'application/json' } })
      .pipe(
        catchError((error) => {
          console.error('Erro na chamada staffUpdateAccount:', error);
          return throwError(() => new Error('Erro ao atualizar conta do staff.'));
        })
      );
  }

  staffUpdateAddress(address: address, staffId: number, addressId: number): Observable<address> {

    return this.http.put<address>(` ${this.urlStaff}/UpdateAddress/${staffId}/${addressId}`,
      address, { headers: { 'Content-Type': 'application/json' } }
    ).pipe
      (
        catchError((error) => {
          console.error('Erro na chamada staffUpdateAddress:', error);
          return throwError(() => new Error('Erro ao atualizar endereço do staff.'));
        })
      )
  }

  staffUpdateContact(contact: contact, staffId: number, contactId: number): Observable<contact> {

    return this.http.put<contact>(`${this.urlStaff}/UpdateContact/${staffId}/${contactId}`,
      contact, { headers: { 'Content-Type': 'application/json' } })
      .pipe(
        catchError((error) => {
          console.error('Erro na chamada staffUpdateContact:', error);
          return throwError(() => new Error('Erro ao atualizar contato do staff.'));
        })
      )
  }

  staffDeleteAccount(staffId: number): Observable<account> {
    return this.http.delete<account>(`${this.urlStaff}/DeleteAccount/${staffId}`)
      .pipe(
        catchError((error) => {
          console.error('Erro na chamada staffDeleteAccount:', error);
          return throwError(() => new Error('Erro ao excluir conta do staff.'));
        })
      );
  }

  staffDeleteAddress(staffId: number, addressId: number): Observable<address> {
    return this.http.delete<address>(`${this.urlStaff}/DeleteAddress/${staffId}/${addressId}`)
      .pipe(
        catchError((error) => {
          console.error('Erro na chamada satffDeleteAddress:', error);
          return throwError(() => new Error('Erro ao excluir endereço do staff.'));
        })
      );
  }

  staffDeleteContact(staffId: number, contactId: number): Observable<contact> {
    return this.http.delete<contact>(`${this.urlStaff}/DeleteContact/${staffId}/${contactId}`)
      .pipe(
        catchError((error) => {
          console.error('Erro na chamada staffDeleteContact:', error);
          return throwError(() => new Error('Erro ao excluir contato do staff.'));
        })
      );
  }
}