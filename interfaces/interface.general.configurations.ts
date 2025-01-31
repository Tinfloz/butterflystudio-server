import { Schema, Document } from "mongoose";

export interface IConfigurations extends Document {
    _id: Schema.Types.ObjectId,
   "name":string,
   "type":string,
   "templateId":string,
   "configurations": Record<string,any>,
   "createdBy":Schema.Types.ObjectId,
   "createdAt":Date,
   "updatedAt":Date
}

export interface IAddConfigurations {
    name: string,
    type:string,
    configurations:Record<string,any>,
    templateId:string
}