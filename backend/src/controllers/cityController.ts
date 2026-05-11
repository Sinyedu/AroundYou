import { Request, Response } from "express";
import {
  getRouteParam,
  isValidationError,
  sendCreateError,
  visibleFilter,
} from "./controllerUtils";
import {
  createCityRecord,
  findCities,
  findCityById,
  findCityByName as findCityByNameRecord,
  hideCityRecord,
  queryCities,
  queryCitiesByField,
  restoreCityRecord,
  updateCityRecord,
} from "../services/city.service";

/**
 * CREATE CITY
 */
export async function createCity(req: Request, res: Response): Promise<void> {
  try {
    const result = await createCityRecord(req.body as Record<string, unknown>);

    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating city:", err);
    sendCreateError(res, err, "Error creating city");
  }
}

/**
 * GET ALL CITIES
 */
export async function getAllCities(req: Request, res: Response): Promise<void> {
  try {
    const result = await findCities(visibleFilter(req));
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
    const result = await findCityById(getRouteParam(req.params.id), visibleFilter(req));

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
 * GET CITY BY NAME
 */
export async function getCityByName(req: Request, res: Response): Promise<void> {
  try {
    const cityNameParam = getRouteParam(req.params.cityName);

    if (!cityNameParam) {
      res.status(400).json({ message: "City name is required" });
      return;
    }

    const matchingCity = await findCityByNameRecord(cityNameParam, visibleFilter(req));

    if (!matchingCity) {
      res.status(404).json({ message: "City not found" });
      return;
    }

    res.status(200).json(matchingCity);
  } catch (err) {
    console.error("Error fetching city by name:", err);
    res.status(500).json({
      message: "Error retrieving city",
    });
  }
}

/**
 * UPDATE CITY
 */
export async function updateCityById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await updateCityRecord(
      getRouteParam(req.params.id),
      req.body as Record<string, unknown>,
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
    if (isValidationError(err)) {
      res.status(400).json({ message: err.message });
      return;
    }

    res.status(500).json({
      message: "Error updating city",
    });
  }
}

/**
 * HIDE CITY
 */
export async function deleteCityById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await hideCityRecord(getRouteParam(req.params.id), req.user?.userID);

    if (!result) {
      res.status(404).json({ message: "City not found" });
      return;
    }

    res.status(200).json({ message: "City hidden successfully", data: result });
  } catch (err) {
    console.error("Error deleting city:", err);
    res.status(500).json({
      message: "Error deleting city",
    });
  }
}

export async function restoreCityById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await restoreCityRecord(getRouteParam(req.params.id));

    if (!result) {
      res.status(404).json({ message: "City not found" });
      return;
    }

    res.status(200).json({ message: "City restored successfully", data: result });
  } catch (err) {
    console.error("Error restoring city:", err);
    res.status(500).json({
      message: "Error restoring city",
    });
  }
}

/**
 * QUERY CITY (KEY / VALUE)
 */
export async function getCityByQuery(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const key = req.params.key as string;
    const value = req.params.value as string;

    const result = await queryCitiesByField(key, value, visibleFilter(req));

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
export async function getCityByGenericQuery(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await queryCities(req.body, visibleFilter(req));

    res.status(200).json(result);
  } catch (err) {
    console.error("Error generic city query:", err);
    res.status(500).json({
      message: "Error retrieving cities",
    });
  }
}
