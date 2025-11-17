import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { user } from '../../models/user';
import { catchError, Observable, throwError } from 'rxjs';
import { account } from '../../models/account';
import { userAll } from '../../models/userAll';
import { address } from '../../models/address';
import { contact } from '../../models/contact';
import { environment } from '../../environments/environment';
import { pagination } from '../../models/pagination';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  urlUser = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) {

  }

  getAllUsers(): Observable<user[]> {
    return this.http.get<user[]>(this.urlUser).pipe(
      catchError((error) => {
        console.error('Erro em getAllUsers:', error);
        return throwError(() => new Error('Erro ao listar users.'));
      })
    );
  }

  getAllUsersPagination(pageNumber: number, pageSize: number, search: string): Observable<pagination<user>> {
    return this.http.get<pagination<user>>(`${this.urlUser}/GetAllPagination/${pageNumber}/${pageSize}?search=${search}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getGetAllPagination:', error);
        return throwError(() => Error('Erro ao obter lista paginada de users.'));
      })
    );
  }

  getUserById(id: number): Observable<user> {
    return this.http.get<user>(`${this.urlUser}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro em getUserById:', error);
        return throwError(() => new Error('Erro ao ler user.'));
      })
    );
  }

  getUserByEmail(email: string): Observable<user> {
    return this.http.get<user>(`${this.urlUser}/GetByEmail?email=${email}`).pipe(
      catchError((error) => {
        console.error('Erro em getUserByEmail', error);
        return throwError(() => new Error('Erro ao obter user por email.'));
      })
    );
  }

  getByIdWithAll(id: number): Observable<userAll> {
    return this.http.get<userAll>(`${this.urlUser}/GetByIdWithAll/${id}`).pipe(
      catchError((error) => {
        console.error('Erro em getByIdWithAll:', error);
        return throwError(() => new Error('Erro ao listar users.'));
      })
    );
  }

  addUser(user: user): Observable<user> {
    return this.http.post<user>(this.urlUser, user,
      {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError((error) => {
          console.error('Erro na chamada addUser:', error);
          return throwError(() => new Error('Erro ao adicionar usuário.'));
        })
      );
  }

  updateUser(user: user): Observable<user> {
    return this.http.put<user>(`${this.urlUser}/${user.id}`,
      user, { headers: { 'Content-Type': 'application/json' } }).pipe(
        catchError((error) => {
          console.error('Erro na chamada updateUser:', error)
          return throwError(() => new Error('Erro ao atualizar usuário.'))
        })
      );
  }

  deleteUser(id: number): Observable<user> {
    return this.http.delete<user>(`${this.urlUser}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada deleteUser.', error)
        return throwError(() => new Error('Erro ao apagar user.'))
      })
    );
  }

  userAddAccount(account: account, userId: number): Observable<account> {
    return this.http.post<account>(`${this.urlUser}/AddAccount/${userId}`, account, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada userAddAccount:', error);
        return throwError(() => new Error('Erro ao adicionar conta ao usuário.'));
      })
    );
  }

  userAddAddress(address: address, userId: number): Observable<address> {
    return this.http.post<address>(`${this.urlUser}/AddAddress/${userId}`, address,
      { headers: { 'Content-Type': 'application/json' } }).pipe(
        catchError((error) => {

          console.error('Erro na chamada userAddAddress:', error);
          return throwError(() => new Error('Erro ao adicionar endereço do usuário.'));
        })
      )
  }

  userAddContact(contact: contact, userId: number): Observable<contact> {
    return this.http.post<contact>(`${this.urlUser}/AddContact/${userId}`, contact,
      { headers: { 'Content-Type': 'application/json' } }).pipe(
        catchError((error) => {
          console.error('Erro na chamada userAddContact:', error);
          return throwError(() => new Error('Erro ao adicionar contacto do usuário.'));
        })
      )
  }

  userUpdateAccount(account: account, userId: number): Observable<account> {
    return this.http.put<account>(`${this.urlUser}/UpdateAccount/${userId}`, account,
      { headers: { 'Content-Type': 'application/json' } }).pipe(
        catchError((error) => {
          console.error('Erro na chamada userUpdateAccount', error);
          return throwError(() => new Error('Erro ao atualizar conta do usuário.'));
        })
      )
  }

  userUpdateContact(contact: contact, userId: number, contactId: number): Observable<contact> {

    return this.http.put<contact>(`${this.urlUser}/UpdateContact/${userId}/${contactId}`, contact,
      { headers: { 'Content-Type': 'application/json' } }).pipe(
        catchError((error) => {
          console.error('Erro na chamada userUpdateContact', error);
          return throwError(() => new Error('Erro ao atualizar contacto do usuário.'));
        })
      )
  }

  userUpdateAddress(address: address, userId: number, addressId: number): Observable<address> {

    return this.http.put<address>(`${this.urlUser}/UpdateAddress/${userId}/${addressId}`, address,
      { headers: { 'Content-Type': 'application/json' } }).pipe(
        catchError((error) => {
          console.error('Erro na chamada userUpdateAddress', error);
          return throwError(() => new Error('Erro ao atualizar endereço do usuário.'));
        })
      )
  }

  userDeleteAccount(userId: number): Observable<account> {
    return this.http.delete<account>(`${this.urlUser}/DeleteAccount/${userId}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada userDeleteAccount', error);
        return throwError(() => new Error('Erro ao apagar conta do usuário.'));
      })
    )
  }

  userDeleteAddress(userId: number, addressId: number): Observable<address> {
    return this.http.delete<address>(`${this.urlUser}/DeleteAddress/${userId}/${addressId}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada de userDeleteAddress', error);
        return throwError(() => new Error('Erro ao apagar endereço do usuário'));
      })
    );
  }

  userDeleteContact(userId: number, contactId: number): Observable<contact> {
    return this.http.delete<contact>(`${this.urlUser}/DeleteContact/${userId}/${contactId}`).pipe(
      catchError((error) => {

        console.error('Erro na chamada de userDeleteContact', error);
        return throwError(() => new Error('Erro ao apagar contacto do usuário'));
      })
    )
  }
}