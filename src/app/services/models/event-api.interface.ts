import { Obj } from "@popperjs/core";

export interface IApiResponseEvent {
    id: number,
    user_id: number,
    name: string,
    description: string,
    location: string,
    price: string,
    capacity: number,
    current_attendees: number,
    category: string,
    picture: string,
    website: string,
    starts_at: string,
    finish_in: string,
    created_at: string,
    updated_at: string,
    comments_count: number,
    reposts_count: number,
    likes_count: number,
    comments: Array<object>,
    user: {
        id: number,
        username: string,
        avatar: string,
    }
}