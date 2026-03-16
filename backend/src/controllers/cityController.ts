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
  } catch (err) {
    console.error("Error creating city:", err);

    res.status(500).json("An error occurred while creating the city." + err);
  } finally {
    await disconnectFromDatabase();
  }
}