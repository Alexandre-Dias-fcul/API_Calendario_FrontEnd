import { Component } from '@angular/core';
import { staff } from '../../../models/staff';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../../services/back-office-staff/staff.service';
import { pagination } from '../../../models/pagination';

@Component({
  selector: 'app-staff-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css'
})
export class StaffListComponent {

  pagination: pagination<staff> = {
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
    private staffService: StaffService
  ) {
    this.getStaff(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
  }

  getStaff(pageNumber: number, pageSize: number, searchTerm: string) {
    this.staffService.getAllStaffPagination(pageNumber, pageSize, searchTerm).subscribe({
      next: (data) => {
        this.pagination = data;

        this.pagesArray = this.getPagesArray();
      },
      error: (error) => {
        console.error("Error fetching staff:", error);
        this.errorMessage = error;
      }
    });
  }

  onSearch(event: Event) {

    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.getStaff(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);

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
      this.getStaff(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
    }
  }


  goToPage(page: number) {
    this.pagination.pageNumber = page;
    this.getStaff(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
  }

  increment() {
    if (this.pagination.pageNumber < this.pagination.totalPages) {
      this.pagination.pageNumber++;
      this.getStaff(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
    }
  }


  deleteStaff(id: number) {
    if (confirm("Tem a certeza que pretende apagar este administrativo ?")) {
      this.staffService.deleteStaff(id).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error("Error deleting staff:", error);
          this.errorMessage = error;
        }
      })
    }
  }
}
