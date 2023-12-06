import { Component, Input } from '@angular/core';
import { CampaignStatusComponent } from '../components/campaign-status/campaign-status.component';
import { FormatMoneyPipe } from '../../utils/pipes/format-money';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  imports: [CampaignStatusComponent, FormatMoneyPipe, RouterLink],
  templateUrl: './campaign-card.component.html',
  styleUrl: './campaign-card.component.scss',
})
export class CampaignCardComponent {
  @Input() id: number;
  @Input() title = '';
  @Input() status: 'on' | 'off';
  @Input() bidAmount: number;
  @Input() town = '';
}
