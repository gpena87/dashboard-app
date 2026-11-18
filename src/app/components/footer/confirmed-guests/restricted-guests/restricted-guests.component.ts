import { Component, input } from '@angular/core';

@Component({
  selector: 'app-restricted-guests',
  imports: [],
  templateUrl: './restricted-guests.component.html',
})
export class RestrictedGuestsComponent {
  count = input.required<number>();
}
