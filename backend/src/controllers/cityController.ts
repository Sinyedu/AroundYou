import { Request, Response } from "express";
import { CityModel } from "../models/cityModel";
import { connectionToDatabase, disconnectFromDatabase } from "../repository/database";
import { buildDynamicQuery } from "./dynamicQueryBuilder";


/**
 * Add new CITY to the database
 * @param req
 * @param res
 */
export async function createCity(req: Request, res: Response): Promise<void> {
    const data = req.body;
    
    try {
        await connectionToDatabase();

        const city = new CityModel(data);
        const result = await city.save();

        res.status(201).json(result);
    }
    catch (err) {
        console.error("Error creating city:", err);

        res.status(500).json("An error occurred while creating the city." + err);
    }
    finally {
        await disconnectFromDatabase();
  }
}

/**
 * Retrieve all CITIES from the database
 * @param req
 * @param res
 */
export async function getAllCities(req: Request, res: Response) {
    try {
        await connectionToDatabase();

        const result = await CityModel.find({});

        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json("error retrieving the cities." + err);
    }
    finally {
        await disconnectFromDatabase();
    }
}