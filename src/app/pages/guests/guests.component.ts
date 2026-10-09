import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { ConfirmedGuestsComponent } from '../../components/confirmed-guests/confirmed-guests.component';
import { RestrictedGuestsComponent } from '../../components/restricted-guests/restricted-guests.component';
import { Guest, GuestUpdate, GuestsService } from '../../services/guests.service';

interface GuestFilters {
  name: string;
  email: string;
  numberPhone: string;
  restriccion: string;
  confirmation: string;
  createdAt: string;
  message: string;
}

const EMPTY_FILTERS: GuestFilters = {
  name: '',
  email: '',
  numberPhone: '',
  restriccion: '',
  confirmation: '',
  createdAt: '',
  message: ''
};

@Component({
  selector: 'app-guests',
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, ConfirmedGuestsComponent, RestrictedGuestsComponent],
  templateUrl: './guests.component.html',
})
export class GuestsComponent implements OnInit {
  guests = signal<Guest[]>([]);
  confirmedGuestsCount = computed(() => this.guests().filter((guest) => guest.confirmation).length);
  restrictedGuestsCount = computed(
    () => this.guests().filter((guest) => this.hasRestriction(guest.restriccion)).length
  );
  filters = signal<GuestFilters>({ ...EMPTY_FILTERS });
  filteredGuests = computed(() => {
    const f = this.filters();
    const has = (value: string | null | undefined, term: string) =>
      (value ?? '').toLowerCase().includes(term.trim().toLowerCase());

    return this.guests().filter(
      (guest) =>
        has(`${guest.name} ${guest.lastName}`, f.name) &&
        has(guest.email, f.email) &&
        has(guest.numberPhone, f.numberPhone) &&
        has(guest.restriccion, f.restriccion) &&
        (f.confirmation === '' || String(guest.confirmation) === f.confirmation) &&
        has((guest.createdAt ?? '').slice(0, 10), f.createdAt) &&
        has(guest.message, f.message)
    );
  });
  hasActiveFilters = computed(() => Object.values(this.filters()).some((value) => value.trim() !== ''));
  editingId = signal<string | null>(null);
  editDraft: Required<GuestUpdate> = this.emptyDraft();
  saving = signal(false);
  deleteTarget = signal<Guest | null>(null);
  deleting = signal(false);
  editError = signal<string | null>(null);
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

  setFilter(field: keyof GuestFilters, value: string): void {
    this.filters.update((filters) => ({ ...filters, [field]: value }));
  }

  clearFilters(): void {
    this.filters.set({ ...EMPTY_FILTERS });
  }

  hasRestriction(restriccion: string | null | undefined): boolean {
    const value = (restriccion ?? '').trim().toLowerCase();
    return !['', '-', 'no', 'ninguna', 'ninguno', 'sin restriccion', 'sin restricción'].includes(value);
  }

  private emptyDraft(): Required<GuestUpdate> {
    return { name: '', lastName: '', email: '', numberPhone: '', confirmation: false, restriccion: '', message: '' };
  }

  startEdit(guest: Guest): void {
    this.editDraft = {
      name: guest.name ?? '',
      lastName: guest.lastName ?? '',
      email: guest.email ?? '',
      numberPhone: guest.numberPhone ?? '',
      confirmation: !!guest.confirmation,
      restriccion: guest.restriccion ?? '',
      message: guest.message ?? ''
    };
    this.editError.set(null);
    this.editingId.set(guest._id);
  }

  cancelEdit(): void {
    if (!this.saving()) {
      this.editingId.set(null);
    }
  }

  saveEdit(): void {
    const id = this.editingId();
    if (!id || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.editError.set(null);
    this.guestsService.updateGuest(id, { ...this.editDraft }).subscribe({
      next: (updated) => {
        this.guests.update((guests) =>
          guests.map((guest) => (guest._id === id ? { ...guest, ...this.editDraft, ...updated } : guest))
        );
        this.saving.set(false);
        this.editingId.set(null);
      },
      error: () => {
        this.saving.set(false);
        this.editError.set('No se pudo guardar los cambios.');
      }
    });
  }

  requestDelete(guest: Guest): void {
    this.deleteTarget.set(guest);
  }

  cancelDelete(): void {
    if (!this.deleting()) {
      this.deleteTarget.set(null);
    }
  }

  confirmDelete(): void {
    const guest = this.deleteTarget();
    if (!guest || this.deleting()) {
      return;
    }

    this.deleting.set(true);
    this.guestsService.deleteGuest(guest._id).subscribe({
      next: () => {
        this.guests.update((guests) => guests.filter((item) => item._id !== guest._id));
        this.deleting.set(false);
        this.deleteTarget.set(null);
      },
      error: () => {
        this.deleting.set(false);
        this.deleteTarget.set(null);
        this.error.set('No se pudo eliminar el invitado.');
      }
    });
  }
}
