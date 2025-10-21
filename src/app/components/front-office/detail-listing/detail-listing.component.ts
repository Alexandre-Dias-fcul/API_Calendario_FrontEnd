import { Component } from '@angular/core';
import { listing } from '../../../models/listing';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../../services/back-office-agent/listing.service';
import { agent } from '../../../models/agent';
import { AgentService } from '../../../services/back-office/agent.service';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { FavoriteService } from '../../../services/front-office/favorite.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedBackService } from '../../../services/front-office/feed-back.service';
import { feedBack } from '../../../models/feedBack';
import { UserService } from '../../../services/front-office/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-listing',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './detail-listing.component.html',
  styleUrl: './detail-listing.component.css'
})
export class DetailListingComponent {

  listing: listing = {
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

  };

  agent: agent =
    {
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
      isActive: true
    }

  feedBackUsers: Array<any>[] = [];

  role: string | null;

  feedBackForm: FormGroup;

  isSubmited = false;

  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute,
    private listingService: ListingService,
    private agentService: AgentService,
    private authorization: AuthorizationService,
    private favoriteService: FavoriteService,
    private fb: FormBuilder,
    private feedBackService: FeedBackService,
    private userService: UserService
  ) {

    this.feedBackForm = this.fb.group({
      rate: [0],
      comment: ['', [Validators.required]]
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));

    const userId = Number(this.authorization.getId());

    this.role = this.authorization.getRole();

    if (id) {
      this.listingService.getListingById(id).subscribe(
        {
          next: (response) => {

            this.listing = response;

            this.agentService.getAgentById(response.agentId).subscribe(
              {
                next: (data) => {

                  this.agent = data;

                }, error: (error) => {
                  console.error('Erro ao obter agent:', error);
                  this.errorMessage = error;
                }

              });

            this.feedBackService.getFeedBackByListingId(this.listing.id).subscribe({

              next: (data) => {

                const feedBacks = data;

                feedBacks.forEach((feedBack) => {

                  if (feedBack.listingId == this.listing.id && feedBack.userId == userId) {
                    this.isSubmited = true;
                  }

                  this.userService.getUserById(feedBack.userId).subscribe({

                    next: (response) => {

                      const feedBackData = {
                        id: feedBack.id,
                        rate: feedBack.rate,
                        comment: feedBack.comment,
                        commentDate: this.toDateInputString(feedBack.commentDate),
                        listingId: feedBack.listingId,
                        userId: feedBack.userId
                      }

                      this.feedBackUsers.push([feedBackData, response]);

                    }
                    , error: (error) => {
                      console.error("Erro ao buscar usuário:", error);
                      this.errorMessage = error;
                    }

                  });
                });
              }, error: (error) => {
                console.error("Erro ao listar feedBacks:", error);
                this.errorMessage = error;
              }
            });


          }, error: (error) => {
            console.error('Erro ao obter listing:', error);
            this.errorMessage = error;
          }
        });

    }
  }

  addFavorite() {

    this.favoriteService.addFavorite(this.listing.id).subscribe({
      next: () => {

      },
      error: (error) => {

        console.error('Erro ao acicionar aos favoritos:', error);
        this.errorMessage = error;
      }
    });

  }


  onSubmit() {

    if (this.feedBackForm.valid) {

      const feedBackData: feedBack =
      {
        id: 0,
        rate: Number(this.feedBackForm.get('rate')?.value),
        comment: this.feedBackForm.get('comment')?.value,
        commentDate: new Date(),
        listingId: this.listing.id,
        userId: 0
      }

      this.feedBackService.addFeedBack(feedBackData).subscribe({
        next: () => {

          this.isSubmited = true;
          window.location.reload();
        },
        error: (error) => {

          console.error('Erro ao adicionar FeedBack:', error);
          this.errorMessage = error;
        }
      }
      );
    }
    else {
      console.error('Formulário inválido.');
      this.errorMessage = 'Formulário inválido.';
    }
  }

  private toDateInputString(date: Date | string | null | undefined): string | null {
    // Caso seja null, undefined ou string vazia
    if (!date) return null;

    // Se já estiver no formato YYYY-MM-DD, retorna direto
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // Tenta converter para Date
    const d = typeof date === 'string' ? new Date(date) : date;

    // Verifica se a data é válida
    if (!(d instanceof Date) || isNaN(d.getTime())) {
      return null;
    }

    // Formata para YYYY-MM-DD (formato aceito por inputs type="date")
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
