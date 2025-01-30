export interface IResponse {
    success:boolean,
    message:string
}

export interface IErrorThrowResponse {
    status:number,
    jsonBody:IResponse
}

export interface IResponseOk extends IResponse {
    data:Record<string, any> | null
}