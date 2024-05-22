export interface IApiResponseComment {
    id: number,
    user_id: number,
    event_id: number,
    parent_comment_id: number,
    content: string,
    created_at: string,
    updated_at: string,
}