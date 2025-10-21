import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { agent } from '../../../models/agent';
import { AgentService } from '../../../services/back-office/agent.service';
import { staff } from '../../../models/staff';
import { StaffService } from '../../../services/back-office-staff/staff.service';

@Component({
  selector: 'app-main-page',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

  role: string | null = null;
  id: number;
  employee: agent | staff = {
    id: 0,
    name: {
      firstName: '',
      middleNames: [],
      lastName: ''
    },
    dateOfBirth: null,
    gender: '',
    hiredDate: null,
    dateOfTermination: null,
    photoFileName: '',
    role: 0,
    supervisorId: null,
    isActive: true,
  };
  errorMessage: string | null = null;

  constructor(private authorization: AuthorizationService,
    private agentService: AgentService,
    private staffService: StaffService,
    private router: Router) {

    this.role = authorization.getRole();

    this.id = Number(this.authorization.getId());

    this.agentService.getAgentById(this.id).subscribe({
      next: (data) => {
        if (data != null) {

          this.employee = data;
        }
        else {
          this.staffService.getStaffById(this.id).subscribe({
            next: (response) => {
              this.employee = response;
            },
            error: (error) => {
              console.error('Error fetching staff Data:', error);
              this.errorMessage = error;
            }
          })

        }
      },
      error: (error) => {
        console.error('Error fetching agent data:', error);
        this.errorMessage = error;
      }
    });

  }

  logout() {
    this.authorization.clearToken();
    this.router.navigate(['/front-page', 'login']);
  }
}
