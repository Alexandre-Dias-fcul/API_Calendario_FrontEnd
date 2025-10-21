import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ListingService } from '../../../services/back-office-agent/listing.service';

@Component({
  selector: 'app-listing-self-reassign',
  imports: [RouterLink],
  templateUrl: './listing-self-reassign.component.html',
  styleUrl: './listing-self-reassign.component.css'
})
export class ListingSelfReassignComponent {

  idAgent: number;

  idListing: number;

  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private listingService: ListingService) {

    this.idAgent = Number(this.route.snapshot.paramMap.get('idAgent'));

    this.idListing = Number(this.route.snapshot.paramMap.get('idListing'));

    if (!this.idAgent || !this.idListing) {
      return;
    }


  }

  reassign() {

    this.listingService.selfReassign(this.idListing).subscribe({
      next: () => {

        this.router.navigate(['/main-page/agent-reassign/', this.idAgent]).then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        console.error('Erro no SelfReassign:', error);
        this.errorMessage = error;

      }
    });
  }
}
