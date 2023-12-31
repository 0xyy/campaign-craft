import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BalanceService } from '../api/balance/balance.service';
import { Subscription, forkJoin, switchMap } from 'rxjs';
import { FormatMoneyPipe } from '../utils/pipes/format-money';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../layouts/loading/loading.component';

@Component({
  selector: 'app-balance',
  standalone: true,
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
  imports: [
    FormatMoneyPipe,
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
  ],
})
export class BalanceComponent implements OnInit, OnDestroy {
  balanceService = inject(BalanceService);
  toast = inject(ToastrService);
  getBalanceSubscription: Subscription;
  updateBalanceSubscription: Subscription;
  getTransactionsHistorySubscription: Subscription;
  balanceAmount: number = 0;
  balanceForm: FormGroup;
  transactionsHistory: TransactionsHistory[];
  isBalanceLoading: boolean;
  isTransactionsLoading: boolean;

  ngOnInit() {
    this.isTransactionsLoading = true;
    this.isBalanceLoading = true;
    this.getBalanceSubscription = this.balanceService
      .getCurrentBalance()
      .subscribe({
        next: (balance) => {
          this.balanceAmount = balance.amount;
          this.isBalanceLoading = false;
        },
        error: (e) => {
          this.toast.error(e.statusText);
          this.isBalanceLoading = false;
        },
      });

    this.getTransactionsHistorySubscription = this.balanceService
      .getTransactionsHistory()
      .subscribe({
        next: (transactionsHistory) => {
          this.transactionsHistory = transactionsHistory.slice(-10).reverse();
          this.isTransactionsLoading = false;
        },
        error: (e) => {
          this.toast.error(e.statusText);
          this.isTransactionsLoading = false;
        },
      });

    this.balanceForm = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.min(1)]),
    });
  }

  onSubmit() {
    const amount = this.balanceForm.get('amount')?.value;
    if (amount) {
      this.updateBalanceSubscription = this.balanceService
        .updateBalance(amount)
        .pipe(
          switchMap(() =>
            forkJoin([
              this.balanceService.getCurrentBalance(),
              this.balanceService.getTransactionsHistory(),
            ])
          )
        )
        .subscribe({
          next: ([balance, transactions]) => {
            this.balanceAmount = balance.amount;
            this.transactionsHistory = transactions.slice(-10).reverse();
          },
          error: (e) =>
            this.toast.error(
              'Something went wrong, please try again',
              e.statusText
            ),
        });
    }
    this.balanceForm.reset();
  }

  ngOnDestroy() {
    if (this.getBalanceSubscription) this.getBalanceSubscription.unsubscribe();
    if (this.updateBalanceSubscription)
      this.updateBalanceSubscription.unsubscribe();
    if (this.getTransactionsHistorySubscription)
      this.getTransactionsHistorySubscription.unsubscribe();
  }
}
