import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ListingService } from '../../../services/back-office-agent/listing.service';
import { listing } from '../../../models/listing';

@Component({
  selector: 'app-listing-edit',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './listing-edit.component.html',
  styleUrl: './listing-edit.component.css'
})
export class ListingEditComponent {

  listingForm: FormGroup;

  id: number = 0;

  listing: listing =
    {
      id: 0,
      type: '',
      status: 0,
      numberOfRooms: 0,
      numberOfBathrooms: 0,
      numberOfKitchens: 0,
      price: 0,
      location: '',
      area: 0,
      parking: 0,
      description: '',
      mainImageFileName: '',
      otherImagesFileNames: '',
      agentId: 0
    }

  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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
        image: [null],
        secondaryImage: [null]
      }
    );

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.id) {
      return;
    }

    this.listingService.getListingById(this.id).subscribe({
      next: (data: listing) => {

        this.listing = data;

        this.listingForm.patchValue({

          type: data.type,
          status: data.status,
          numberOfRooms: data.numberOfRooms,
          numberOfBathrooms: data.numberOfKitchens,
          numberOfKitchens: data.numberOfKitchens,
          price: data.price,
          location: data.location,
          area: data.area,
          parking: data.parking,
          description: data.description
        });

      },
      error: (error) => {
        console.error('Erro ao obter Listing:', error);
        this.errorMessage = error;
      }
    });
  }

  uploadFile(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    document.getElementById('imageName')!.textContent = file.name;

    this.listingForm.patchValue({ image: file });
    this.listingForm.get('image')?.updateValueAndValidity();
  }

  uploadSecondaryFile(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    document.getElementById('secondaryImageName')!.textContent = file.name;

    this.listingForm.patchValue({ secondaryImage: file });
    this.listingForm.get('secondaryImage')?.updateValueAndValidity();
  }

  getFileName(path: string) {

    let fileName = path.split('/').pop();

    if (fileName) {
      fileName = fileName.replace(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g, "").replace(/__/g, "_").trim();
    }

    return fileName;

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

      this.listingService.updateListing(this.id, formData).subscribe({
        next: (response) => {
          console.log('Listing atualizada com sucesso:', response);

          this.router.navigate(['/main-page/listing-list']);
        },
        error: (error) => {
          console.error('Erro ao atualizar listing:', error);
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
