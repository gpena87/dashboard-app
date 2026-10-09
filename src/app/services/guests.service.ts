import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Guest {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  numberPhone: string;
  confirmation: boolean;
  restriccion: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export type GuestUpdate = Partial<
  Pick<Guest, 'name' | 'lastName' | 'email' | 'numberPhone' | 'confirmation' | 'restriccion' | 'message'>
>;

@Injectable({
  providedIn: 'root'
})
export class GuestsService {
  private readonly apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getGuests(): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.apiUrl);
  }

  updateGuest(id: string, changes: GuestUpdate): Observable<Guest> {
    return this.http.patch<Guest>(`${this.apiUrl}/${id}`, changes);
  }

  deleteGuest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
