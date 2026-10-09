import { Component, input } from '@angular/core';

@Component({
  selector: 'app-confirmed-guests',
  imports: [],
  templateUrl: './confirmed-guests.component.html',
})
export class ConfirmedGuestsComponent {
  count = input.required<number>();
}
