import { model, Schema, Types } from "mongoose";
import { IConfigurations } from "../interfaces/interface.general.configurations";
import mongoose from "mongoose";
const configurations = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    configurations: {
        type: Object,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    templateId: {
        type: String,
        required: true
    }
});

configurations.pre("save", async function (next) {
    let db = mongoose.connection.db;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    let template = await db?.collection("masterdata").findOne({ _id: new Types.ObjectId(this.templateId) });
    if (!template) throw new Error("Template not found!");
    let TemplateConfigurationsSchema = new Schema(template.schema);
    if (mongoose.models[template.name]) {
        delete mongoose.models[template.name];
    }
    let TemplateConfigurationsModel= model<Record<string, any>>(template.name, TemplateConfigurationsSchema);

    let configurationsInput = new TemplateConfigurationsModel(this.configurations);
    await configurationsInput.validate();
    return true;
});

export const Configurations = model<IConfigurations>("Configurations", configurations);