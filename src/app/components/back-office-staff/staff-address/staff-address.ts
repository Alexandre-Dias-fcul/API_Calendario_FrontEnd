import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { address } from '../../../models/address';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StaffService } from '../../../services/back-office-staff/staff.service';

@Component({
  selector: 'app-staff-address',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './staff-address.html',
  styleUrl: './staff-address.css'
})
export class StaffAddress {

  staffId: number;
  addressForm: FormGroup;
  errorMessage: string | null = null;
  addressId: number;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private staffService: StaffService,
    private router: Router) {

    this.addressForm = this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });

    this.staffId = Number(this.route.snapshot.paramMap.get('idStaff'));

    this.addressId = Number(this.route.snapshot.paramMap.get('idAddress'));

    if (!this.staffId) {
      return;
    }

    if (this.addressId) {

      this.staffService.getByIdWithAll(this.staffId).subscribe({

        next: (response) => {
          const address = response.entityLink?.addresses?.find(addr => addr.id === this.addressId);

          if (address) {
            this.addressForm.patchValue({
              street: address.street,
              city: address.city,
              postalCode: address.postalCode,
              country: address.country
            });
          }
        },
        error: (error) => {
          console.error('Erro ao obter address:', error);
          this.errorMessage = error;
        }
      });
    }
  }

  onSubmit() {
    if (this.addressForm.valid) {

      const addressData: address = {
        id: this.addressId ? this.addressId : 0,
        street: this.addressForm.value.street,
        city: this.addressForm.value.city,
        postalCode: this.addressForm.value.postalCode,
        country: this.addressForm.value.country
      };

      if (this.addressId) {

        this.staffService.staffUpdateAddress(addressData, this.staffId, this.addressId).subscribe({
          next: () => {
            this.router.navigate(['/main-page/staff-address-list', this.staffId]);
          },
          error: (error) => {
            console.error('Erro ao editar endereço:', error);
            this.errorMessage = error;
          }
        });
      }
      else {
        this.staffService.staffAddAddress(addressData, this.staffId).subscribe({
          next: () => {
            this.router.navigate(['/main-page/staff-address-list', this.staffId]);
          },
          error: (error) => {
            console.error('Erro ao adicionar endereço:', error);
            this.errorMessage = error;
          }
        });
      }

    }
    else {
      console.log("Formulário inválido");
      this.errorMessage = "Formulário inválido.";
    }
  }

}
