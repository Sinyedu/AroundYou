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

/**
 * Retrieve an CITY by ID from the database
 * @param req
 * @param res
 */
export async function getCityById(req: Request, res: Response) {
    try {
        await connectionToDatabase();

        const cityId = req.params.id;
        const result = await CityModel.findById(cityId);

        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json("error retrieving city by ID. Error: " + err);
    }
    finally {
        await disconnectFromDatabase();
    }
}

/**
 * Update an CITY by ID in the database
 * @param req
 * @param res
 */
export async function updateCityById(req: Request, res: Response) {

    const cityId = req.params.id;

    try {
        await connectionToDatabase();

        const result = await CityModel.findByIdAndUpdate(cityId, req.body, { new: true });

        if (!result) {
            res.status(404).json("Cannot find city with id=: " + cityId);
        } else {
            res.status(200).json("City was updated successfully.");
        }
    }
    catch (err) {
        res.status(500).json("error updating city by ID. Error: " + err);
    }
    finally {
        await disconnectFromDatabase();
    }
}