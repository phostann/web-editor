export interface HttpResult<T> {
    code: number;
    message: number;
    data: T;
}

export interface PageData<T> {
    page: number;
    size: number;
    total: number;
    totalPage: number;
    content: Array<T>
}
