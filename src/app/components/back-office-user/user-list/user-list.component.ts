import { Component } from '@angular/core';
import { user } from '../../../models/user';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/front-office/user.service';
import { CommonModule } from '@angular/common';
import { pagination } from '../../../models/pagination';


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
  pagesArray: number[] = [];

  constructor(
    private userService: UserService
  ) {

    this.getUsers(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
  }

  getUsers(pageNumber: number, pageSize: number, searchTerm: string) {
    this.userService.getAllUsersPagination(pageNumber, pageSize, searchTerm).subscribe({
      next: (data) => {
        this.pagination = data;
        this.pagesArray = this.getPagesArray();
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

  getPagesArray(): number[] {
    let pages: number[] = [];

    for (let i = 1; i <= this.pagination.totalPages; i++) {
      pages.push(i);
    }

    return pages;
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
