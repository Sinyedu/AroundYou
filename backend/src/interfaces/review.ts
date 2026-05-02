export interface Review extends Document {
    reviewID: string;
    author: string;
    title: string;
    description: string;
    rating: number;
    likes: number;
    image: string;
    createdAt: Date;
}
