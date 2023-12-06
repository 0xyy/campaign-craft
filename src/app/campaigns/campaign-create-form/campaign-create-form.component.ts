import { Component } from '@angular/core';
import { CampaignFormComponent } from '../components/campaign-form/campaign-form.component';

@Component({
  standalone: true,
  imports: [CampaignFormComponent],
  template: '<app-campaign-form/>',
})
export class CampaignCreateFormComponent {}
