export type ReviewTargetType = 'city' | 'event' | 'attraction';

export interface Review extends Document {
    reviewID: string;
    targetId: string;
    targetType: ReviewTargetType;
    author: string;
    title: string;
    description: string;
    rating: number;
    likes: number;
    likedBy: string[];
    edited: boolean;
    image: string;
    createdAt: Date;
}
