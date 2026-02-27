import { User } from "./user";

export interface Review extends Document {
    reviewID: string;
    author: User['userID'];
    title: string;
    description: string;
    rating: number;
    likes: number;
    image: string;
    createdAt: Date;
}