export interface ReducerType {
    type: string
    payload: object
}

export interface ErrorPayloadType {
    error: string
    message: string
    status: number
    fields?: string[]
}
