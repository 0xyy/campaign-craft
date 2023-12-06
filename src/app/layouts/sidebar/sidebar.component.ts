import { Component } from '@angular/core';
import { LogoComponent } from './logo/logo.component';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  imports: [LogoComponent, NavComponent],
})
export class SidebarComponent {}
