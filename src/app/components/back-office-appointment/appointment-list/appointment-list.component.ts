import { Component } from '@angular/core';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../services/back-office-appointment/appointment.service';
import { appointmentWithParticipants } from '../../../models/appointmentWithParticipants';
import { pagination } from '../../../models/pagination';
import { participant } from '../../../models/participant';
import { Console } from 'node:console';

@Component({
  selector: 'app-appointment-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent {

  employeeId: number;
  pagination: pagination<appointmentWithParticipants> = {
    items: [],
    pageNumber: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0
  };

  errorMessage: string | null = null;
  searchTerm: string = '';
  pagesArray: (number | string)[] = [];

  constructor(
    private authorization: AuthorizationService,
    private appointmentService: AppointmentService) {

    this.employeeId = Number(this.authorization.getId());

    this.getAppointments(this.employeeId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
  }

  getAppointments(employeeId: number, pageNumber: number, pageSize: number, searchTerm: string) {
    this.appointmentService.getAppointmentsPaginationByEmployeeId(employeeId, pageNumber, pageSize, searchTerm).subscribe({
      next: (response) => {
        this.pagination = response;
        this.pagesArray = this.getPagesArray(this.pagination.totalPages, this.pagination.pageNumber);
      },
      error: (error) => {
        console.error('Error fetching appointments', error);
        this.errorMessage = error;
      }
    });
  }


  onSearch(event: Event) {

    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.getAppointments(this.employeeId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);

  }

  getPagesArray(totalPages: number, currentPage: number): (number | string)[] {
    const pages: (number | string)[] = [];

    if (totalPages <= 1) {
      return [1];
    }

    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push("...");
    }

    for (let p = start; p <= end; p++) {
      pages.push(p);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }

  decrement() {
    if (this.pagination.pageNumber > 1) {
      this.pagination.pageNumber--;
      this.getAppointments(this.employeeId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
    }
  }

  goToPage(page: number) {
    this.pagination.pageNumber = page;
    this.getAppointments(this.employeeId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
  }

  increment() {
    if (this.pagination.pageNumber < this.pagination.totalPages) {
      this.pagination.pageNumber++;
      this.getAppointments(this.employeeId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
    }
  }

  isOrganizer(participant: participant[]) {
    if (participant.some(p => p.role === 0 && p.employeeId === this.employeeId)) {
      return true;
    }
    return false;
  }

  findParticipant(participant: participant[]): participant | null {
    let foundParticipant = null;

    participant.forEach(participant => {

      if (participant.employeeId === this.employeeId && participant.role === 1) {

        foundParticipant = participant;
      }
    });

    return foundParticipant;
  }

  deleteAppointment(idAppointment: number) {
    if (confirm('Tem a certeza que pretende apagar a reunião?')) {
      this.appointmentService.deleteAppointment(idAppointment).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting appointment:', error);
          this.errorMessage = error
        }
      });
    }
  }


  deleteParticipant(idAppointment: number, participantId: number) {
    if (confirm('Tem a certeza que quer apagar a sua participação na reunião?')) {
      this.appointmentService.deleteParticipant(idAppointment, participantId).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting participant:', error);
          this.errorMessage = error;
        }
      });
    }
  }

}
