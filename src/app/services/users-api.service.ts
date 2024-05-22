import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { IApiResponseUser } from './models/user-api.interface';

export class UsersApiService {

  private readonly url = 'http://127.0.0.1:8000/api/';
  httpClient = inject(HttpClient)
  constructor() { }

  getUsers() {
    return this.httpClient.get<IApiResponseUser[]>(this.url + 'users')
  }
}
