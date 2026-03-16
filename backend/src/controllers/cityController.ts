import { Request, Response } from "express";
import { CityModel } from "../models/cityModel";
import { connectionToDatabase, disconnectFromDatabase } from "../repository/database";
import { buildDynamicQuery } from "./dynamicQueryBuilder";

