import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  template: '<p>Loading ...</p>',
  styles: `
  p {
    text-align: center;
    font-weight: 500;
    font-size: 2rem;
  }
  `,
})
export class LoadingComponent {}
