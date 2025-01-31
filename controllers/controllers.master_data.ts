import { Request, Response } from "express";
import { resObjectMaker } from "../utils/utils.response.instance";
import mongoose from 'mongoose';

const getAllMasterData = async (req:Request,res:Response):Promise<void>=>{
    try{
        let db = mongoose.connection.db;
        let masterData = await db?.collection("master_data").find({}).toArray();
        const all_blocks = await db?.collection("master_data").find({}).toArray();
        res.status(200).json(resObjectMaker.getOkResponseObject("Master data fetched successfully!", all_blocks));
    }catch(error:any){
        res.status(error?.status ?? 500).json(error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!"));
    }
}

const getMasterDataById = async (req:Request,res:Response):Promise<void>=>{
    try{
        let db = mongoose.connection.db;
        let masterData = await db?.collection("master_data").find({"_id":new mongoose.Types.ObjectId(req.params.id)}).toArray();
        res.status(200).json(resObjectMaker.getOkResponseObject("Master data fetched successfully!", masterData));
    }catch(error:any){
        res.status(error?.status ?? 500).json(error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!"));
    }
}

const getMasterDataByName = async (req:Request,res:Response):Promise<void>=>{
    try{
        let db = mongoose.connection.db;
        let masterData = await db?.collection("master_data").find({name:req.params.name}).toArray();
        res.status(200).json(resObjectMaker.getOkResponseObject("Master data fetched successfully!", masterData));
    }catch(error:any){
        res.status(error?.status ?? 500).json(error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!"));
    }
}

const getMasterDataByType = async (req:Request,res:Response):Promise<void>=>{
    try{
        let db = mongoose.connection.db;
        let masterData = await db?.collection("master_data").find({type:req.params.type}).toArray();
        res.status(200).json(resObjectMaker.getOkResponseObject("Master data fetched successfully!", masterData));
    }catch(error:any){
        res.status(error?.status ?? 500).json(error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!"));
    }
}

export {getAllMasterData, getMasterDataById,getMasterDataByName,getMasterDataByType};