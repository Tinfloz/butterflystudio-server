import { Request, Response } from "express";
import { Configurations } from "../models/models.general.configurations";
import { resObjectMaker } from "../utils/utils.response.instance";
import { IAddConfigurations } from "../interfaces/interface.general.configurations";

export const createConfigurations = async (req: Request, res: Response) => {
    try {
        const { name, type, configurations, templateId } = req.body as IAddConfigurations;
        if (!name || !type || !configurations || !templateId) throw resObjectMaker.getErrThrowResponseObject(400, "Parameters are missing!");
        let createdBy = req.user?._id;
        const newConfigurations = await Configurations.create({ name, type, configurations, templateId, createdBy });
    if (!newConfigurations) throw resObjectMaker.getErrThrowResponseObject(500, "Configurations could not be created");
    res.status(201).json(
        resObjectMaker.getOkResponseObject("Configurations created successully!", {
            name,
            type,
            configurations,
            templateId,
            createdBy
            })
        )
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!"));
    }
}

export const getConfigurationsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) throw resObjectMaker.getErrThrowResponseObject(400, "Parameters are missing!");
        const configurations = await Configurations.findById(id);
        if (!configurations) throw resObjectMaker.getErrThrowResponseObject(404, "Configurations not found!");
        res.status(200).json(resObjectMaker.getOkResponseObject("Configurations fetched successfully!", configurations));
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!"));
    }
}

export const getConfigurationsByTemplateId = async (req: Request, res: Response) => {
    try {
        const { templateId } = req.params;
        if (!templateId) throw resObjectMaker.getErrThrowResponseObject(400, "Parameters are missing!");
        const configurations = await Configurations.find({ templateId });
        if (!configurations) throw resObjectMaker.getErrThrowResponseObject(404, "Configurations not found!");
        res.status(200).json(resObjectMaker.getOkResponseObject("Configurations fetched successfully!", configurations));
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!"));
    }
}      

export const getConfigurationsByType = async (req: Request, res: Response) => {
    try {
        const { type } = req.params;
        if (!type) throw resObjectMaker.getErrThrowResponseObject(400, "Parameters are missing!");
        const configurations = await Configurations.find({ type });
        if (!configurations) throw resObjectMaker.getErrThrowResponseObject(404, "Configurations not found!");
        res.status(200).json(resObjectMaker.getOkResponseObject("Configurations fetched successfully!", configurations));
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!"));
    }
}   

export const getAllConfigurations = async (req: Request, res: Response) => {
    try {
        const configurations = await Configurations.find();
        if (!configurations) throw resObjectMaker.getErrThrowResponseObject(404, "Configurations not found!");
        res.status(200).json(resObjectMaker.getOkResponseObject("Configurations fetched successfully!", configurations));
    } catch (error: any) {
        console.error(error);
    }
}