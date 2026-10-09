import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-confirmed-guests',
  imports: [],
  templateUrl: './confirmed-guests.component.html',
})
export class ConfirmedGuestsComponent {
  count = input.required<number>();

  colorClasses = computed(() => {
    const count = this.count();
    if (count >= 100) {
      return 'bg-success';
    }
    return count >= 50 ? 'bg-warning' : 'bg-error';
  });
}
