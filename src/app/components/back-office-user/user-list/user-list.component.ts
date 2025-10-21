import { Component } from '@angular/core';
import { user } from '../../../models/user';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/front-office/user.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {

  users: user[] = [];
  errorMessage: string | null = null;

  constructor(
    private userService: UserService
  ) {

    this.userService.getAllUsers().subscribe({

      next: (response) => {
        this.users = response;
      },
      error: (error) => {
        console.error('Error fetching staffs:', error);
        this.errorMessage = error;
      }
    });
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
