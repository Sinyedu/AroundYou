import { Request, Response } from "express";
import { ReviewModel } from "../models/reviewModel";
import { connectionToDatabase, disconnectFromDatabase } from "../repository/database";
import { buildDynamicQuery } from "./dynamicQueryBuilder";