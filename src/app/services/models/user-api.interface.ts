export interface IApiResponseUser {
    id: number,
    username: string,
    nickname: string,
    email: string,
    email_verified_at: string,
    phone: string,
    biography: string,
    location: string,
    website: string,
    birthday: string,
    avatar: string,
    type: string,
    created_at: string,
    updated_at: string,
}

export interface IApiResponseFollower {
    id: number;
    follower_id: number;
    following_id: number;
    created_at: string;
    updated_at: string;
    follower: {
        id: number;
        username: string;
        nickname: string;
        email: string;
        phone: string;
        biography: string;
        location: string;
        website: string;
        birthday: string;
        avatar: string;
        banner: string;
        type: string;
        created_at: string;
        updated_at: string;
    }
}

export interface IApiResponseFollowing {
    id: number;
    follower_id: number;
    following_id: number;
    created_at: string;
    updated_at: string;
    following: {
        id: number;
        username: string;
        nickname: string;
        email: string;
        phone: string;
        biography: string;
        location: string;
        website: string;
        birthday: string;
        avatar: string;
        banner: string;
        type: string;
        created_at: string;
        updated_at: string;
    }
}