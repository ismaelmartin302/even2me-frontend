import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { IApiResponseEvent } from "./models/event-api.interface";
import { Observable } from "rxjs";

export class EventsApiService {

  private readonly url = 'http://127.0.0.1:8000/api/';
  httpClient = inject(HttpClient)

  constructor() { }
  getEvents() {
    return this.httpClient.get<IApiResponseEvent[]>(this.url + 'events')
  }
  getEventById(id: number): Observable<IApiResponseEvent> {
    return this.httpClient.get<IApiResponseEvent>(`${this.url}events/${id}`);
  }
  deleteEvent(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}events/${id}`);
  }
  searchEvents(query: string): Observable<IApiResponseEvent[]> {
    return this.httpClient.get<IApiResponseEvent[]>(`${this.url}event/search`, { params: { query } });
  }
}
