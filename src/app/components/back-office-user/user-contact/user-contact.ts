import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/front-office/user.service';

@Component({
  selector: 'app-user-contact',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-contact.html',
  styleUrl: './user-contact.css'
})
export class UserContact {

  contactForm: FormGroup;
  userId: number;
  errorMessage: string | null = null;
  contactId: number;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      contactType: ['', [Validators.required]],
      value: ['', [Validators.required]]
    });

    this.userId = Number(this.route.snapshot.paramMap.get('idUser'));

    this.contactId = Number(this.route.snapshot.paramMap.get('idContact'));

    if (!this.userId) {
      return;
    }

    if (this.contactId) {
      this.userService.getByIdWithAll(this.userId).subscribe({
        next: (response) => {
          const contact = response.entityLink?.contacts?.find(contacto => contacto.id === this.contactId);

          if (contact) {
            this.contactForm.patchValue({
              contactType: contact.contactType,
              value: contact.value
            });
          }
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
          this.errorMessage = error;
        }
      });
    }

  }

  onSubmit() {

    if (this.contactForm.valid) {

      const type = this.contactForm.value.contactType;
      const value = this.contactForm.value.value;

      if (type == 1) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          this.contactForm.get('value')?.setErrors({ email: true });
          return;
        }
      }

      const contactData = {
        id: this.contactId ? this.contactId : 0,
        contactType: Number(type),
        value: value,
      };

      if (this.contactId) {

        this.userService.userUpdateContact(contactData, this.userId, this.contactId).subscribe({
          next: () => {
            this.router.navigate(['/main-page/user-contact-list', this.userId]);
          },
          error: (error) => {
            console.error('Erro ao alterar contacto:', error);
            this.errorMessage = error;
          }
        });

      } else {
        this.userService.userAddContact(contactData, this.userId).subscribe({
          next: () => {
            this.router.navigate(['/main-page/user-contact-list', this.userId]);
          },
          error: (error) => {
            console.error('Erro ao adicionar contacto:', error);
            this.errorMessage = error;
          }
        });
      }
    }
    else {
      console.log('Formulário inválido.');
      this.errorMessage = 'Formulário inválido.';
    }
  }
}
