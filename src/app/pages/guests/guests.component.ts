import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { Guest, GuestsService } from '../../services/guests.service';

@Component({
  selector: 'app-guests',
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './guests.component.html',
})
export class GuestsComponent implements OnInit {
  guests = signal<Guest[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private guestsService: GuestsService) {}

  ngOnInit(): void {
    this.guestsService.getGuests().subscribe({
      next: (guests) => {
        this.guests.set(guests);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de invitados.');
        this.loading.set(false);
      }
    });
  }

  deleteGuest(id: string): void {
    this.guestsService.deleteGuest(id).subscribe({
      next: () => {
        this.guests.update((guests) => guests.filter((guest) => guest._id !== id));
      },
      error: () => {
        this.error.set('No se pudo eliminar el invitado.');
      }
    });
  }
}
