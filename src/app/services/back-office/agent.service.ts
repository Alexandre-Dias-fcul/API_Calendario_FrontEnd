import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { agent } from '../../models/agent';
import { account } from '../../models/account';
import { address } from '../../models/address';
import { contact } from '../../models/contact';
import { agentAll } from '../../models/agentAll';
import { agentListing } from '../../models/agentListing';
import { agentSupervisor } from '../../models/agentSupervisor';
import { agentParticipant } from '../../models/agentParticipant';
import { environment } from '../../environments/environment';
import { agentPersonalContact } from '../../models/agentPersonalContact';
import { pagination } from '../../models/pagination';
@Injectable({
  providedIn: 'root'
})
export class AgentService {

  urlAgent: string = `${environment.apiUrl}/Agent`;
  constructor(private http: HttpClient) { }

  getAllAgents(): Observable<agent[]> {
    return this.http.get<agent[]>(this.urlAgent).pipe(
      catchError((error) => {
        console.error('Erro na chamada getAllAgents', error);
        return throwError(() => Error('Erro ao listar agents.'));
      }
      )
    );
  }

  getAllAgentsPagination(pageNumber: number, pageSize: number, search: string): Observable<pagination<agent>> {
    return this.http.get<pagination<agent>>(`${this.urlAgent}/GetAllPagination/${pageNumber}/${pageSize}?search=${search}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getGetAllPagination:', error);
        return throwError(() => Error('Erro ao obter lista paginada de agents.'));
      })
    );
  }

  getAgentById(id: number): Observable<agent> {
    return this.http.get<agent>(`${this.urlAgent}/${id}`).pipe(
      catchError((error) => {

        console.error('Erro na chamada getAgentById:', error);

        return throwError(() => Error('Erro ao obter agent.'));
      })
    );
  }

  getAgentByEmail(email: string): Observable<agent> {
    return this.http.get<agent>(`${this.urlAgent}/GetByEmail?email=${email}`).pipe(
      catchError((error) => {

        console.error('Erro na chamada getAgentByEmail:', error);

        return throwError(() => Error('Erro ao obter agent.'));
      })
    );
  }

  getByIdWithAll(id: number): Observable<agentAll> {
    return this.http.get<agentAll>(`${this.urlAgent}/GetByIdWithAll/${id}`).pipe(
      catchError((error) => {

        console.error('Erro na chamada getByIdWithAll:', error);

        return throwError(() => Error('Erro ao obter agent.'));
      })
    );
  }

  getByIdWithListings(id: number): Observable<agentListing> {
    return this.http.get<agentListing>(`${this.urlAgent}/GetByIdWithListings/${id}`).pipe(
      catchError((error) => {

        console.error('Erro na chamada getByIdWithListings:', error);

        return throwError(() => Error('Erro ao obter agent com listings.'));
      })
    );
  }

  getByIdWithAgents(id: number): Observable<agentSupervisor> {
    return this.http.get<agentSupervisor>(`${this.urlAgent}/GetByIdWithAgents/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada getByIdWithAgents', error);
        return throwError(() => Error('Erro ao obter agent com agents.'));
      })
    );
  }

  getByIdWithPersonalContacts(id: number): Observable<agentPersonalContact> {
    return this.http.get<agentPersonalContact>(`${this.urlAgent}/GetByIdWithPersonalContacts/${id}`).pipe(
      catchError((error) => {

        console.error('Erro na chamada getByIdWithPersonalContacs:', error);

        return throwError(() => Error('Erro ao obter agente com personal contacts.'))
      })
    )
  }

  getByIdWithParticipants(id: number): Observable<agentParticipant> {
    return this.http.get<agentParticipant>(`${this.urlAgent}/GetByIdWithParticipants/${id}`).pipe(
      catchError((error) => {

        console.error('Erro na chamada getByIdWithParticipants:', error);

        return throwError(() => Error('Erro ao obter agente com participantes.'));
      })
    );
  }

  addAgent(agent: agent): Observable<agent> {
    return this.http.post<agent>(this.urlAgent, agent, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada addAgent:', error);
        return throwError(() => new Error('Erro ao adicionar agente.'));
      })
    );
  }

  updateAgent(agent: agent): Observable<agent> {
    return this.http.put<agent>(`${this.urlAgent}/${agent.id}`, agent,
      { headers: { 'Content-Type': 'application/json' } }).pipe(
        catchError((error) => {
          console.error('Erro na chamada updateAgent:', error);

          return throwError(() => new Error('Erro ao atualizar agente.'));
        })
      );
  }

  deleteAgent(id: number): Observable<agent> {
    return this.http.delete<agent>(`${this.urlAgent}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada deleteAgent:', error);

        return throwError(() => new Error('Erro ao apagar agente.'));
      })
    );
  }

  agentAddAccount(account: account, agentId: number): Observable<account> {
    return this.http.post<account>(`${this.urlAgent}/AddAccount/${agentId}`, account, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada agentAddAccount:', error);
        return throwError(() => new Error('Erro ao adicionar conta ao agente.'));
      })
    );
  }

  agentAddAddress(address: address, agentId: number): Observable<address> {
    return this.http.post<address>(`${this.urlAgent}/AddAddress/${agentId}`, address, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada agentAddAddress:', error);
        return throwError(() => new Error('Erro ao adicionar endereço ao agente.'));
      })
    );
  }

  agentAddContact(contact: contact, agentId: number): Observable<contact> {
    return this.http.post<contact>(`${this.urlAgent}/AddContact/${agentId}`, contact, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada agentAddContact:', error);
        return throwError(() => new Error('Erro ao adicionar contato ao agente.'));
      })
    );
  }

  agentUpdateAccount(account: account, agentId: number): Observable<account> {
    return this.http.put<account>(`${this.urlAgent}/UpdateAccount/${agentId}`, account, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada agentUpdateAccount:', error);
        return throwError(() => new Error('Erro ao atualizar conta do agente.'));
      })
    );
  }

  agentUpdateAddress(address: address, agentId: number, addressId: number): Observable<address> {
    return this.http.put<address>(`${this.urlAgent}/UpdateAddress/${agentId}/${addressId}`, address, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada agentUpdateAddress:', error);
        return throwError(() => new Error('Erro ao atualizar endereço do agente.'));
      })
    );
  }

  agentUpdateContact(contact: contact, agentId: number, contactId: number): Observable<contact> {
    return this.http.put<contact>(`${this.urlAgent}/UpdateContact/${agentId}/${contactId}`, contact, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Erro na chamada agentUpdateContact:', error);
        return throwError(() => new Error('Erro ao atualizar contato do agente.'));
      })
    );
  }

  agentDeleteAccount(agentId: number): Observable<account> {
    return this.http.delete<account>(`${this.urlAgent}/DeleteAccount/${agentId}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada agentDeleteAccount:', error);
        return throwError(() => new Error('Erro ao apagar account do agente.'));
      })
    );
  }

  agentDeleteAddress(agentId: number, addressId: number): Observable<address> {
    return this.http.delete<address>(`${this.urlAgent}/DeleteAddress/${agentId}/${addressId}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada agentDeleteAddress:', error);
        return throwError(() => new Error('Erro ao apagar address do agente.'));
      })
    );
  }

  agentDeleteContact(agentId: number, contactId: number): Observable<contact> {
    return this.http.delete<contact>(`${this.urlAgent}/DeleteContact/${agentId}/${contactId}`).pipe(
      catchError((error) => {
        console.error('Erro na chamada agentDeleteContact:', error);
        return throwError(() => new Error('Erro ao apagar contato do agente.'));
      })
    );
  }
}
