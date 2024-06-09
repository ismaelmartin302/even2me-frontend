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
}
