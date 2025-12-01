import { Component } from '@angular/core';
import { user } from '../../../models/user';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/front-office/user.service';
import { CommonModule } from '@angular/common';
import { pagination } from '../../../models/pagination';
import { format } from 'date-fns';


@Component({
  selector: 'app-user-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {

  pagination: pagination<user> = {
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
    private userService: UserService
  ) {

    this.getUsers(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
  }

  getUsers(pageNumber: number, pageSize: number, searchTerm: string) {
    this.userService.getAllUsersPagination(pageNumber, pageSize, searchTerm).subscribe({
      next: (data) => {
        this.pagination = data;
        this.pagesArray = this.getPagesArray(this.pagination.totalPages, this.pagination.pageNumber);
      }
      ,
      error: (error) => {
        console.error("Error fetching users:", error);
        this.errorMessage = error;
      }
    });
  }

  onSearch(event: Event) {

    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.getUsers(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);

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

  dateFormat(date: Date | null) {

    if (date === null) {
      return '';
    }

    return format(date, 'dd-MM-yyyy');
  }

  decrement() {
    if (this.pagination.pageNumber > 1) {
      this.pagination.pageNumber--;
      this.getUsers(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
    }
  }

  goToPage(page: number) {
    this.pagination.pageNumber = page;
    this.getUsers(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
  }

  increment() {
    if (this.pagination.pageNumber < this.pagination.totalPages) {
      this.pagination.pageNumber++;
      this.getUsers(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
    }
  }

  deleteUser(id: number) {
    if (confirm("Tem a certeza que quer apagar o user ?")) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error("Error deleting user:", error);
          this.errorMessage = error;
        }
      });
    }
  }
}
