import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-campaign-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-status.component.html',
  styleUrl: './campaign-status.component.scss',
})
export class CampaignStatusComponent {
  @Input() status: 'on' | 'off';
}
