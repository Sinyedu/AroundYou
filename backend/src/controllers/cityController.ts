import { Request, Response } from "express";
import { CityModel } from "../models/cityModel";
import { buildDynamicQuery } from "./dynamicQueryBuilder";

/**
 * CREATE CITY
 */
export async function createCity(req: Request, res: Response): Promise<void> {
  try {
    const city = new CityModel(req.body);
    const result = await city.save();

    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating city:", err);
    res.status(500).json({
      message: "Error creating city",
    });
  }
}

/**
 * GET ALL CITIES
 */
export async function getAllCities(req: Request, res: Response): Promise<void> {
  try {
    const result = await CityModel.find({});
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching cities:", err);
    res.status(500).json({
      message: "Error retrieving cities",
    });
  }
}

/**
 * GET CITY BY ID
 */
export async function getCityById(req: Request, res: Response): Promise<void> {
  try {
    const result = await CityModel.findById(req.params.id);

    if (!result) {
      res.status(404).json({ message: "City not found" });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching city:", err);
    res.status(500).json({
      message: "Error retrieving city",
    });
  }
}

/**
 * UPDATE CITY
 */
export async function updateCityById(req: Request, res: Response): Promise<void> {
  try {
    const result = await CityModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!result) {
      res.status(404).json({
        message: "City not found",
      });
      return;
    }

    res.status(200).json({
      message: "City updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating city:", err);
    res.status(500).json({
      message: "Error updating city",
    });
  }
}

/**
 * DELETE CITY
 */
export async function deleteCityById(req: Request, res: Response): Promise<void> {
  try {
    const result = await CityModel.findByIdAndDelete(req.params.id);

    if (!result) {
      res.status(404).json({ message: "City not found" });
      return;
    }

    res.status(200).json({ message: "City deleted successfully" });
  } catch (err) {
    console.error("Error deleting city:", err);
    res.status(500).json({
      message: "Error deleting city",
    });
  }
}

/**
 * QUERY CITY (KEY / VALUE)
 */
export async function getCityByQuery(req: Request, res: Response): Promise<void> {
  try {
    const key = req.params.key as string;
    const value = req.params.value as string;

    const result = await CityModel.find({
      [key]: { $regex: value, $options: "i" },
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error querying cities:", err);
    res.status(500).json({
      message: "Error retrieving cities by query",
    });
  }
}

/**
 * GENERIC QUERY
 */
export async function getCityByGenericQuery(req: Request, res: Response): Promise<void> {
  try {
    const query = buildDynamicQuery(CityModel, req.body);

    const result = await CityModel.find(query);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error generic city query:", err);
    res.status(500).json({
      message: "Error retrieving cities",
    });
  }
}
