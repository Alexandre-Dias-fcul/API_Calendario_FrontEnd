import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { favorite } from '../../models/favorite';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  urlFavorite = `${environment.apiUrl}/Favorite`;

  constructor(private http: HttpClient) {


  }

  getAllFavorites(): Observable<favorite[]> {
    return this.http.get<favorite[]>(this.urlFavorite).pipe
      (
        catchError((error) => {
          console.error('Erro na chamada getAllFavorites', error);
          return throwError(() => new Error('Erro ao listar favoritos.'));
        })
      );
  }

  getAllFavoritesByUserId(userId: number): Observable<favorite[]> {
    return this.http.get<favorite[]>(`${this.urlFavorite}/GetAllByUserId/${userId}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getAllFavoritesByUserId', error);

        return throwError(() => new Error('Erro ao listar favoritos.'));
      })
    );
  }

  getFavoriteById(id: number): Observable<favorite> {
    return this.http.get<favorite>(`${this.urlFavorite}/${id}`).pipe
      (
        catchError((error) => {
          console.error('Erro na chamada getFavoriteById:', error);
          return throwError(() => new Error('Erro ao obter favorito.'));
        })
      );
  }

  deleteFavorite(id: number): Observable<favorite> {
    return this.http.delete<favorite>(`${this.urlFavorite}/${id}`).pipe
      (
        catchError((error) => {
          console.error('Erro na chamada deleteFavorite:', error);
          return throwError(() => new Error('Erro ao apagar favorito.'));
        })
      );
  }

  addFavorite(idListing: number): Observable<favorite> {
    return this.http.post<favorite>(`${this.urlFavorite}/${idListing}`,
      { headers: { 'Content-Type': 'application/json' } }).pipe
      (
        catchError((error) => {
          console.error('Erro na chamada addFavorite:', error);
          return throwError(() => new Error('Erro ao adicionar favorito.'));
        })
      );
  }
}
