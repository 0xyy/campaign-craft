import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CampaignService } from '../../../api/campaign/campaign.service';
import { MockDataService } from '../../../api/mock-data/mock-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-campaign-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './campaign-form.component.html',
  styleUrl: './campaign-form.component.scss',
})
export class CampaignFormComponent implements OnInit, OnDestroy {
  mockDataService = inject(MockDataService);
  campaignService = inject(CampaignService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  toast = inject(ToastrService);
  statuses = ['on', 'off'];
  campaignForm: FormGroup;
  campaignSubscription: Subscription;
  keywordsValues: string[] = [];
  towns: string[] = [];
  @Input() isEditing: boolean;

  ngOnInit() {
    this.keywordsValues = this.mockDataService.getKeywords(200);
    this.towns = this.mockDataService.getCityNames();

    this.campaignForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      bidAmount: new FormControl('', [Validators.required, Validators.min(1)]),
      fund: new FormControl('', [Validators.required, Validators.min(1)]),
      status: new FormControl('on', Validators.required),
      town: new FormControl('', Validators.required),
      radius: new FormControl('', [Validators.required, Validators.min(1)]),
      keywords: new FormArray([]),
    });

    if (this.isEditing) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.campaignService.getCampaignById(id).subscribe({
          next: (campaign) => {
            const keywords: FormArray = new FormArray([
              ...campaign.keywords.map((keyword) => new FormControl(keyword)),
            ]);
            this.campaignForm.setValue({
              title: campaign.title,
              bidAmount: campaign.bidAmount,
              fund: campaign.fund,
              status: campaign.status,
              town: campaign.town,
              radius: campaign.radius,
              keywords: [],
            });
            this.campaignForm.setControl('keywords', keywords);
          },
          error: (e) => this.toast.error(e.statusText),
        });
      }
    }
  }

  onSubmit() {
    const campaignObservable = this.isEditing
      ? this.campaignService.updateCampaign(
          Number(this.route.snapshot.paramMap.get('id')),
          this.campaignForm.value
        )
      : this.campaignService.createCampaign(this.campaignForm.value);

    this.campaignSubscription = campaignObservable.subscribe({
      next: (id) => {
        this.campaignForm.reset();
        const toastMessage = this.isEditing ? 'Edited' : 'Created';
        this.router.navigate(['/campaigns', id]);
        this.toast.success(`Campaign ${toastMessage}!`);
      },
      error: (e) => {
        const errorMessage = this.isEditing ? 'edit' : 'create';
        this.toast.error(
          `We could not ${errorMessage} campaign`,
          e.statusText || e.message
        );
      },
    });
  }

  get keywordsControls() {
    return (this.campaignForm.get('keywords') as FormArray).controls;
  }

  onAddKeyword() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.campaignForm.get('keywords')).push(control);
  }

  onClearKeywords() {
    (this.campaignForm.get('keywords') as FormArray).clear();
  }

  ngOnDestroy() {
    if (this.campaignSubscription) this.campaignSubscription.unsubscribe();
  }
}
