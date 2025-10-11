import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { feedBack } from '../../models/feedBack';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedBackService {

  urlFeedBack = `${environment.apiUrl}/FeedBack`;

  constructor(private http: HttpClient) {

  }

  getAllFeedBacks(): Observable<feedBack[]> {
    return this.http.get<feedBack[]>(this.urlFeedBack).pipe(
      catchError((error) => {
        console.error('Erro na chamada getAllFeedBacks.', error);
        return throwError(() => Error('Erro ao listar FeedBacks.'));
      })
    );
  }

  getFeedBackById(id: number): Observable<feedBack> {
    return this.http.get<feedBack>(`${this.urlFeedBack}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getFeedBackById', error);
        return throwError(() => Error('Erro ao obter FeedBack.'));
      })
    );
  }

  getFeedBackByListingId(idListing: number): Observable<feedBack[]> {
    return this.http.get<feedBack[]>(`${this.urlFeedBack}/GetByListingId/${idListing}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getFeedBackByListingId.', error);
        return throwError(() => Error('Erro ao obter FeedBack.'));
      })
    );
  }

  addFeedBack(feedBack: feedBack): Observable<feedBack> {
    return this.http.post<feedBack>(this.urlFeedBack, feedBack, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada addFeedBack:', error);
        return throwError(() => new Error('Erro ao adicionar feedBack.'));
      })
    );

  }

  deleteFeedBack(id: number): Observable<feedBack> {
    return this.http.delete<feedBack>(`${this.urlFeedBack}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada deleteFeedBack', error);
        return throwError(() => new Error('Erro ao apagar Feedback.'));
      })
    );
  }
}
