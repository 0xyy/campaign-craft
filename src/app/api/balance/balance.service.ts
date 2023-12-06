import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BalanceService {
  constructor(private http: HttpClient) {}

  getCurrentBalance() {
    return this.http.get<Balance>(`${environment.apiUrl}/balance`);
  }

  updateBalance(amount: number, title: string = '') {
    return this.getCurrentBalance().pipe(
      switchMap((balance: Balance) => {
        const updatedBalance = balance.amount + amount;

        return this.addToHistory({
          amount,
          title: amount > 0 ? 'deposit' : title,
        }).pipe(
          switchMap((history) => {
            return this.http.patch<void>(`${environment.apiUrl}/balance`, {
              amount: updatedBalance,
            });
          })
        );
      })
    );
  }

  getTransactionsHistory() {
    return this.http.get<TransactionsHistory[]>(
      `${environment.apiUrl}/history`
    );
  }

  addToHistory(data: Omit<TransactionsHistory, 'id'>) {
    return this.http.post(`${environment.apiUrl}/history`, data);
  }
}
