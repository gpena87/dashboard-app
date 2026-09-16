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

@Injectable({
  providedIn: 'root'
})
export class GuestsService {
  private readonly apiUrl = 'https://wedding-api-production-2678.up.railway.app/api/users';

  constructor(private http: HttpClient) {}

  getGuests(): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.apiUrl);
  }
}
