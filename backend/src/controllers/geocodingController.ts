import { Request, Response } from "express";

type NominatimReverseResponse = {
  display_name?: string;
};

function parseCoordinate(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
}

function isValidLatitude(latitude: number): boolean {
  return latitude >= -90 && latitude <= 90;
}

function isValidLongitude(longitude: number): boolean {
  return longitude >= -180 && longitude <= 180;
}

export async function reverseGeocode(
  req: Request,
  res: Response,
): Promise<void> {
  const latitude = parseCoordinate(req.query.lat);
  const longitude = parseCoordinate(req.query.lon);

  if (
    latitude === null ||
    longitude === null ||
    !isValidLatitude(latitude) ||
    !isValidLongitude(longitude)
  ) {
    res.status(400).json({ message: "Invalid latitude or longitude" });
    return;
  }

  try {
    const query = new URLSearchParams({
      format: "json",
      lat: String(latitude),
      lon: String(longitude),
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${query}`,
      {
        headers: {
          "User-Agent": "AroundYou/1.0",
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      res.status(response.status).json({ message: "Reverse geocoding failed" });
      return;
    }

    const data = (await response.json()) as NominatimReverseResponse;
    res
      .status(200)
      .json({ displayName: data.display_name ?? "Unknown location" });
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    res.status(500).json({ message: "Reverse geocoding failed" });
  }
}
