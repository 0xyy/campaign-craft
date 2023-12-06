import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  routerEvents: Subscription;
  router = inject(Router);
  headers = {
    '/campaigns': 'Campaigns List',
    '/campaigns/create': 'Create Campaign',
    '/balance': 'Account Balance',
  };
  header = '';

  ngOnInit() {
    this.routerEvents = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.header = this.headers[event.url as keyof typeof this.headers];
        if (event.url === '/') {
          this.header = this.headers['/campaigns'];
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.routerEvents) this.routerEvents.unsubscribe();
  }
}
