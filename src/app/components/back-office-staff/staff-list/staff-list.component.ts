import { Component } from '@angular/core';
import { staff } from '../../../models/staff';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../../services/back-office-staff/staff.service';

@Component({
  selector: 'app-staff-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css'
})
export class StaffListComponent {
  staffs: staff[] = [];
  errorMessage: string | null = null;

  constructor(
    private staffService: StaffService
  ) {

    this.staffService.getAllStaff().subscribe({
      next: (data) => {
        this.staffs = data;
      },
      error: (error) => {
        console.error('Error fetching staffs:', error);
        this.errorMessage = error;
      }
    })
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
