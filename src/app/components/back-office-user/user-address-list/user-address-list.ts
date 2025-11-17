import { Component } from '@angular/core';
import { address } from '../../../models/address';
import { UserService } from '../../../services/front-office/user.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-address-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './user-address-list.html',
  styleUrl: './user-address-list.css'
})
export class UserAddressList {

  userId: number;
  addresses: address[] = [];
  errorMessage: string | null = null;

  constructor(private userService: UserService,
    private route: ActivatedRoute) {

    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.userId) {
      return;
    }

    this.userService.getByIdWithAll(this.userId).subscribe({
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
      this.userService.userDeleteAddress(this.userId, idAddress).subscribe({
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
