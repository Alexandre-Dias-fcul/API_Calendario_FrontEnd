import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/front-office/user.service';
import { address } from '../../../models/address';

@Component({
  selector: 'app-user-address',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './user-address.html',
  styleUrl: './user-address.css'
})
export class UserAddress {

  userId: number;
  addressForm: FormGroup;
  errorMessage: string | null = null;
  addressId: number;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router) {

    this.addressForm = this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });

    this.userId = Number(this.route.snapshot.paramMap.get('idUser'));

    this.addressId = Number(this.route.snapshot.paramMap.get('idAddress'));

    if (!this.userId) {
      return;
    }

    if (this.addressId) {

      this.userService.getByIdWithAll(this.userId).subscribe({

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

        this.userService.userUpdateAddress(addressData, this.userId, this.addressId).subscribe({
          next: () => {
            this.router.navigate(['/main-page/user-address-list', this.userId]);
          },
          error: (error) => {
            console.error('Erro ao editar endereço:', error);
            this.errorMessage = error;
          }
        });
      }
      else {
        this.userService.userAddAddress(addressData, this.userId).subscribe({
          next: () => {
            this.router.navigate(['/main-page/user-address-list', this.userId]);
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
