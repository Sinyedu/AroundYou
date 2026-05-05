import { Request, Response } from "express";
import { CityModel } from "../models/cityModel";
import { buildDynamicQuery } from "./dynamicQueryBuilder";

function normalizeCityName(value: string): string {
  const withDanishCharsMapped = value
    .toLowerCase()
    .replace(/æ/g, "a")
    .replace(/ø/g, "o")
    .replace(/å/g, "a");

  return withDanishCharsMapped
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function shouldIncludeHidden(req: Request): boolean {
  return req.originalUrl.startsWith("/api/admin/");
}

function visibleFilter(req: Request): Record<string, unknown> {
  if (!shouldIncludeHidden(req)) {
    return { isHidden: { $ne: true } };
  }

  if (req.query.visibility === "hidden") {
    return { isHidden: true };
  }

  if (req.query.visibility === "all") {
    return {};
  }

  return { isHidden: { $ne: true } };
}

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

    if (
      err instanceof Error &&
      "name" in err &&
      err.name === "ValidationError"
    ) {
      res.status(400).json({
        message: err.message,
      });
      return;
    }

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
    const result = await CityModel.find(visibleFilter(req));
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
    const result = await CityModel.findOne({
      _id: req.params.id,
      ...visibleFilter(req),
    });

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
    const cityNameRaw = req.params.cityName;
    const cityNameParam = Array.isArray(cityNameRaw) ? cityNameRaw[0] : cityNameRaw;

    if (!cityNameParam) {
      res.status(400).json({ message: "City name is required" });
      return;
    }

    const normalizedTarget = normalizeCityName(cityNameParam);
    const cities = await CityModel.find(visibleFilter(req));

    const matchingCity = cities.find((city) => {
      return normalizeCityName(city.name) === normalizedTarget;
    });

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
    const result = await CityModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

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
 * HIDE CITY
 */
export async function deleteCityById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await CityModel.findByIdAndUpdate(
      req.params.id,
      {
        isHidden: true,
        hiddenAt: new Date(),
        hiddenBy: req.user?.userID,
      },
      { new: true },
    );

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
    const result = await CityModel.findByIdAndUpdate(
      req.params.id,
      {
        isHidden: false,
        $unset: { hiddenAt: "", hiddenBy: "" },
      },
      { new: true },
    );

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

    const result = await CityModel.find({
      ...visibleFilter(req),
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
export async function getCityByGenericQuery(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const query = buildDynamicQuery(CityModel, req.body);

    const result = await CityModel.find({
      ...query,
      ...visibleFilter(req),
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error generic city query:", err);
    res.status(500).json({
      message: "Error retrieving cities",
    });
  }
}
