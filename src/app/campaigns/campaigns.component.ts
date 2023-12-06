import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CampaignService } from '../api/campaign/campaign.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CampaignCardComponent } from './campaign-card/campaign-card.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [RouterLink, CampaignCardComponent],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.scss',
})
export class CampaignsComponent implements OnInit, OnDestroy {
  campaignService = inject(CampaignService);
  toast = inject(ToastrService);
  campaignSubscription: Subscription;
  campaigns: Campaign[] = [];

  ngOnInit() {
    this.campaignSubscription = this.campaignService
      .getAllCampaigns()
      .subscribe({
        next: (campaigns) => (this.campaigns = campaigns),
        error: (e) => {
          this.toast.error('We could not fetch campaigns', e.statusText);
        },
      });
  }

  ngOnDestroy() {
    if (this.campaignSubscription) this.campaignSubscription.unsubscribe();
  }
}
