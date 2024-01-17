export interface EnhanceOptions<T, R> {
    service: string;
    name?: string;
    onResponse?: (response: R, event: T) => R;
}