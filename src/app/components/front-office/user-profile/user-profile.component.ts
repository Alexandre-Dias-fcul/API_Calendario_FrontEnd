import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/front-office/user.service';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { CommonModule } from '@angular/common';
import { user } from '../../../models/user';

@Component({
  selector: 'app-user-profile',
  imports: [RouterLink, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {


  user: user = {
    id: 0,
    name: {
      firstName: '',
      middleNames: [],
      lastName: ''
    },
    isActive: true,
    gender: '',
    dateOfBirth: null,
    photoFileName: ''
  };

  errorMessage: string | null = null;

  constructor(private userService: UserService,
    private authorization: AuthorizationService
  ) {

    const id = this.authorization.getId();

    this.userService.getUserById(Number(id)).subscribe(
      {
        next: (data) => {

          this.user = data;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          this.errorMessage = error;
        }
      });

  }
}
