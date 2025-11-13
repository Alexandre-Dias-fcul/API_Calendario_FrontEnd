import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { listing } from '../../models/listing';
import { environment } from '../../environments/environment';
import { pagination } from '../../models/pagination';

@Injectable({
  providedIn: 'root'
})

export class ListingService {

  urlListing = `${environment.apiUrl}/Listing`;

  constructor(private http: HttpClient) { }

  getAllListings(): Observable<listing[]> {
    return this.http.get<listing[]>(this.urlListing).pipe(
      catchError((error) => {
        console.error('Erro na chamada getAllListings:', error);
        return throwError(() => new Error('Erro ao listar listings.'));
      })
    );
  }

  getAllListingsSearch(search: string): Observable<listing[]> {
    return this.http.get<listing[]>(`${this.urlListing}/GetAllSearch/?search=${search}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada  getAllListingSearch:', error);
        return throwError(() => new Error('Erro ao listar listings.'));
      })
    );
  }

  getAllListingsPagination(pageNumber: number, pageSize: number, search: string): Observable<pagination<listing>> {
    return this.http.get<pagination<listing>>(`${this.urlListing}/GetAllPagination/${pageNumber}/${pageSize}?search=${search}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getGetAllPagination:', error);
        return throwError(() => Error('Erro ao obter lista paginada de listings.'));
      })
    );
  }

  getListingsPaginationByAgentId(agentId: number, pageNumber: number, pageSize: number, search: string):
    Observable<pagination<listing>> {
    return this.http.get<pagination<listing>>
      (`${this.urlListing}/GetListingsPaginationByAgentId/${agentId}/${pageNumber}/${pageSize}?search=${search}`).pipe(
        catchError((error) => {
          console.error('Erro na chamada getListingsPaginationByAgentId:', error);
          return throwError(() => Error('Erro ao obter lista paginada de listings.'));
        })
      );
  }

  getListingById(id: number): Observable<listing> {
    return this.http.get<listing>(`${this.urlListing}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getListingById:', error);
        return throwError(() => new Error('Erro ao obter listing.'));
      })
    );
  }

  addListing(listingData: FormData): Observable<listing> {
    return this.http.post<listing>(this.urlListing, listingData)
      .pipe(
        catchError((error) => {
          console.error('Erro na chamada addListing:', error);
          return throwError(() => new Error(error.message || 'Erro ao adicionar listing.'));
        })
      );
  }

  updateListing(listing: listing): Observable<listing> {
    return this.http.put<listing>(`${this.urlListing}/${listing.id}`, listing, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada updateListing:', error);
        return throwError(() => new Error('Erro ao atualizar listing.'));
      })
    );
  }

  deleteListing(id: number): Observable<listing> {
    return this.http.delete<listing>(`${this.urlListing}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada de deleteListing', error);
        return throwError(() => new Error('Erro ao apagar Listing.'));
      })
    );;
  }

  selfReassign(id: number) {
    return this.http.post(`${this.urlListing}/SelfReassign/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada de selfReassign:', error);
        return throwError(() => new Error('Erro ao fazer o reassign.'));
      })
    );
  }

  reassignTo(idListing: number, idAgent: number) {
    return this.http.post(`${this.urlListing}/SelfReassignTo/${idListing}/${idAgent}`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada de reassignTo:', error);
        return throwError(() => new Error('Erro ao fazer o reassign.'));
      })
    );
  }

  reassignBetween(idListing: number, idAgent: number) {
    return this.http.post(`${this.urlListing}/BetweenReassign/${idListing}/${idAgent}`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada de reassignBetween:', error);
        return throwError(() => new Error('Erro ao fazer o reassign.'));
      })
    );
  }

}
