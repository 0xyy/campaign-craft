import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampaignService } from '../../api/campaign/campaign.service';
import { CampaignStatusComponent } from '../components/campaign-status/campaign-status.component';
import { FormatMoneyPipe } from '../../utils/pipes/format-money';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '../../layouts/loading/loading.component';

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  templateUrl: './campaign-details.component.html',
  styleUrl: './campaign-details.component.scss',
  imports: [
    CampaignStatusComponent,
    FormatMoneyPipe,
    RouterLink,
    LoadingComponent,
  ],
})
export class CampaignDetailsComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  toast = inject(ToastrService);
  campaignService = inject(CampaignService);
  router = inject(Router);
  getCampaignSubscription: Subscription;
  deleteCampaignSubscription: Subscription;
  loadCompleted = false;
  campaign: Campaign;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getCampaignSubscription = this.campaignService
        .getCampaignById(id)
        .subscribe({
          next: (campaign) => {
            this.campaign = campaign;
            this.loadCompleted = true;
          },
          error: (e) => {
            this.router.navigate(['/campaigns']);
            this.toast.error('Campaign not found', e.statusText);
            this.loadCompleted = true;
          },
        });
    }
  }

  onDelete() {
    if (this.campaign.id) {
      this.deleteCampaignSubscription = this.campaignService
        .deleteCampaignById(this.campaign.id)
        .subscribe({
          next: () => {
            this.router.navigate(['/campaigns']);
            this.toast.success('Campaign Deleted!');
          },
          error: (e) => {
            this.toast.error('We could not delete campaign', e.statusText);
          },
        });
    }
  }

  ngOnDestroy() {
    if (this.getCampaignSubscription)
      this.getCampaignSubscription.unsubscribe();
    if (this.deleteCampaignSubscription)
      this.deleteCampaignSubscription.unsubscribe();
  }
}
