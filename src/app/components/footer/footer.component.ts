import { Component, input } from '@angular/core';
import { RestrictedGuestsComponent } from './restricted-guests/restricted-guests.component';
import { ConfirmedGuestsComponent } from './confirmed-guests/confirmed-guests.component';

@Component({
  selector: 'app-footer',
  imports: [RestrictedGuestsComponent, ConfirmedGuestsComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  restrictedGuestsCount = input<number>(0);
  confirmedGuestsCount = input<number>(0);
}
