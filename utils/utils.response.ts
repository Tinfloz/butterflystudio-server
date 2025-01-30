import { IErrorThrowResponse, IResponse, IResponseOk } from "../interfaces/interfaces.response"

export class ResponseObjectMaker {

    getErrThrowResponseObject (status:number, message:string):IErrorThrowResponse {
        return {
            status,
            jsonBody:{
                success:false, 
                message
            }
        }
    }

    getErrResponseObject(message:string):IResponse {
        return {
            success:false,
            message
        }
    }

    getOkResponseObject(message:string, data?:Record<string, any>):IResponseOk {
        return {
            success:true,
            message,
            data: data ?? null
        }
    }
}