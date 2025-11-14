import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ListingService } from '../../../services/back-office-agent/listing.service';
@Component({
  selector: 'app-listing-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './listing-new.component.html',
  styleUrl: './listing-new.component.css'
})
export class ListingNewComponent {

  listingForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private router: Router,
    private listingService: ListingService
  ) {
    this.listingForm = this.fb.group(
      {
        type: ['', [Validators.required]],
        status: [null, [Validators.required]],
        numberOfRooms: [null],
        numberOfBathrooms: [null],
        numberOfKitchens: [null],
        price: [null, [Validators.required]],
        location: ['', [Validators.required]],
        area: [null, [Validators.required]],
        parking: [null],
        description: ['', [Validators.required]],
        image: [null, Validators.required],
        secondaryImage: [null, Validators.required]
      }
    );

  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    this.listingForm.patchValue({ image: file });
    this.listingForm.get('image')?.updateValueAndValidity();
  }

  uploadSecondaryFile(event: any) {
    const file = event.target.files[0];
    this.listingForm.patchValue({ secondaryImage: file });
    this.listingForm.get('secondaryImage')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.listingForm.valid) {

      const formData = new FormData();
      formData.append('Type', this.listingForm.get('type')?.value);
      formData.append('Status', this.listingForm.get('status')?.value.toString());
      formData.append('NumberOfRooms', this.listingForm.get('numberOfRooms')?.value?.toString() || '0');
      formData.append('NumberOfBathrooms', this.listingForm.get('numberOfBathrooms')?.value?.toString() || '0');
      formData.append('NumberOfKitchens', this.listingForm.get('numberOfKitchens')?.value?.toString() || '0');
      formData.append('Price', this.listingForm.get('price')?.value.toString());
      formData.append('Location', this.listingForm.get('location')?.value);
      formData.append('Area', this.listingForm.get('area')?.value.toString());
      formData.append('Parking', this.listingForm.get('parking')?.value?.toString() || '0');
      formData.append('Description', this.listingForm.get('description')?.value);

      const file = this.listingForm.get('image')?.value;
      if (file) {
        formData.append('Image', file);
      }

      const secondaryFile = this.listingForm.get('secondaryImage')?.value;
      if (secondaryFile) {
        formData.append('SecondaryImage', secondaryFile);
      }

      this.listingService.addListing(formData).subscribe({
        next: () => {
          this.listingForm.reset();
          this.router.navigate(['/main-page/listing-list']);
        },
        error: (error) => {
          console.error('Erro ao criar listing:', error);
          this.errorMessage = error;
        }
      });

    }
    else {
      console.log('Formulário inválido.');
      this.errorMessage = 'Formulário inválido.';
    }
  }
}
