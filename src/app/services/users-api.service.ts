import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { IApiResponseFollower, IApiResponseFollowing, IApiResponseUser } from './models/user-api.interface';
import { Observable } from 'rxjs';
import { IApiResponseEvent } from './models/event-api.interface';

export class UsersApiService {

  private readonly url = 'http://even2me-env.eba-h9cm5deu.eu-west-3.elasticbeanstalk.com/api/';
  httpClient = inject(HttpClient)
  constructor() { }

  getUsers() {
    return this.httpClient.get<IApiResponseUser[]>(this.url + 'users')
  }
  getUserByUsername(username: string): Observable<IApiResponseUser> {
    return this.httpClient.get<IApiResponseUser>(`${this.url}users/nick/${username}`);
  }
  getUserByID(id: number): Observable<IApiResponseUser> {
    return this.httpClient.get<IApiResponseUser>(`${this.url}users/${id}`);
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

  createEvent(eventData: FormData): Observable<IApiResponseEvent> {
    return this.httpClient.post<IApiResponseEvent>(this.url + 'events', eventData);
  }
  likeEvent(eventId: number, userId: number): Observable<any> {
    return this.httpClient.post(`${this.url}events/${eventId}/like`, { user_id: userId });
  }

  unlikeEvent(eventId: number, userId: number): Observable<any> {
    return this.httpClient.request('delete', `${this.url}events/${eventId}/like`, {
      body: { user_id: userId }
    });
  }
  followUser(followerId: number, followingId: number): Observable<any> {
    return this.httpClient.post(`${this.url}followers`, { follower_id: followerId, following_id: followingId });
  }
  updateUser(userId: number, userData: FormData): Observable<any> {
    return this.httpClient.post<IApiResponseUser>(`${this.url}users/${userId}`, userData);
  }
  unfollowUser(followerId: number, followingId: number): Observable<any> {
    return this.httpClient.request('delete', `${this.url}followers`, {
      body: { follower_id: followerId, following_id: followingId }
    });
  }
  searchUsers(query: string): Observable<IApiResponseUser[]> {
    return this.httpClient.get<IApiResponseUser[]>(`${this.url}user/search`, { params: { query } });
  }
  getUserLikes(userId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.url}users/${userId}/likes`);
  }
}
