import { Component } from '@angular/core';
import { address } from '../../../models/address';
import { StaffService } from '../../../services/back-office-staff/staff.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-address-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './staff-address-list.html',
  styleUrl: './staff-address-list.css'
})
export class StaffAddressList {

  staffId: number;
  addresses: address[] = [];
  errorMessage: string | null = null;

  constructor(private staffService: StaffService,
    private route: ActivatedRoute) {
    this.staffId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.staffId) {
      return;
    }

    this.staffService.getByIdWithAll(this.staffId).subscribe({
      next: (response) => {
        if (response.entityLink?.addresses) {

          this.addresses = response.entityLink.addresses;
        }
      },
      error: (error) => {
        console.error('Erro ao obter endereços:', error);
        this.errorMessage = error;
      }
    });
  }

  deleteAddress(idAddress: number) {
    if (confirm('Tem a certeza que pretende apagar o endereço?')) {
      this.staffService.staffDeleteAddress(this.staffId, idAddress).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting address:', error);
          this.errorMessage = error;
        }
      });
    }
  }
}
