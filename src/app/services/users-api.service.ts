import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { IApiResponseFollower, IApiResponseFollowing, IApiResponseUser } from './models/user-api.interface';
import { Observable } from 'rxjs';
import { IApiResponseEvent } from './models/event-api.interface';

export class UsersApiService {

  private readonly url = 'http://127.0.0.1:8000/api/';
  httpClient = inject(HttpClient)
  constructor() { }

  getUsers() {
    return this.httpClient.get<IApiResponseUser[]>(this.url + 'users')
  }
  getUserByUsername(username: string): Observable<IApiResponseUser> {
    return this.httpClient.get<IApiResponseUser>(`${this.url}users/nick/${username}`);
  }

  getUserEvents(username: string): Observable<IApiResponseEvent[]> {
    return this.httpClient.get<IApiResponseEvent[]>(`${this.url}users/nick/${username}/events`);
  }

  getUserFollowers(username: string): Observable<IApiResponseFollower[]> {
    return this.httpClient.get<IApiResponseFollower[]>(`${this.url}users/nick/${username}/followers`);
  }

  getUserFollowings(username: string): Observable<IApiResponseFollowing[]> {
    return this.httpClient.get<IApiResponseFollowing[]>(`${this.url}users/nick/${username}/followings`);
  }
}
