import { User } from "./user";
import { Document } from "mongoose";

export interface Review extends Document {
  author: User["userName"];
  title: string;
  description: string;
  rating: number;
  likes: number;
  image: string;
  createdAt: Date;
}
