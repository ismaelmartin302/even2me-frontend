import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IApiResponseUser } from './models/user-api.interface';

export class UsersApiService {

  private readonly url = 'http://127.0.0.1:8000/api/';
  httpClient = inject(HttpClient)
  constructor() { 
    console.log('UserService')
  }

  getUsers() {
    return this.httpClient.get<IApiResponseUser[]>(this.url + 'users')
  }
}
