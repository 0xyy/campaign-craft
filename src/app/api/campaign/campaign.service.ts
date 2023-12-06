import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap, throwError } from 'rxjs';
import { BalanceService } from '../balance/balance.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  constructor(
    private http: HttpClient,
    private balanceService: BalanceService
  ) {}

  getAllCampaigns() {
    return this.http.get<Campaign[]>(`${environment.apiUrl}/campaigns`);
  }

  getCampaignById(id: number) {
    return this.http.get<Campaign>(`${environment.apiUrl}/campaigns/${id}`);
  }

  createCampaign(data: Omit<Campaign, 'id'>) {
    return this.balanceService.getCurrentBalance().pipe(
      switchMap((balance: Balance) => {
        if (data.fund > balance.amount) {
          return throwError(
            new Error("You don't have enough funds in your account")
          );
        }

        return this.balanceService
          .updateBalance(-data.fund, data.title)
          .pipe(
            switchMap(() =>
              this.http.post<Campaign>(`${environment.apiUrl}/campaigns`, data)
            )
          );
      }),
      map((campaign: Campaign) => campaign.id)
    );
  }

  updateCampaign(id: number, data: Omit<Campaign, 'id'>) {
    return this.http
      .put<Campaign>(`${environment.apiUrl}/campaigns/${id}`, data)
      .pipe(map((campaign: Campaign) => campaign.id));
  }

  deleteCampaignById(id: number) {
    return this.http.delete(`${environment.apiUrl}/campaigns/${id}`);
  }
}
