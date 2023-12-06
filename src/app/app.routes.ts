import { Routes } from '@angular/router';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
import { BalanceComponent } from './balance/balance.component';
import { CampaignCreateFormComponent } from './campaigns/campaign-create-form/campaign-create-form.component';
import { CampaignDetailsComponent } from './campaigns/campaign-details/campaign-details.component';
import { CampaignEditFormComponent } from './campaigns/campaign-edit-form/campaign-edit-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/campaigns', pathMatch: 'full' },
  {
    path: 'campaigns',
    children: [
      {
        path: '',
        title: 'Campaigns',
        component: CampaignsComponent,
      },
      {
        path: 'create',
        component: CampaignCreateFormComponent,
      },
      {
        path: 'edit/:id',
        component: CampaignEditFormComponent,
      },
      {
        path: ':id',
        component: CampaignDetailsComponent,
      },
    ],
  },
  {
    path: 'balance',
    title: 'Balance',
    component: BalanceComponent,
  },
  { path: '**', title: 'Page not found', component: NotFoundComponent },
];
