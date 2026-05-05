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
    reportCount: number;
    reports: ReviewReport[];
    reportResolved: boolean;
    reportResolvedAt?: Date;
    reportResolvedBy?: string;
    isHidden: boolean;
    hiddenAt?: Date;
    hiddenBy?: string;
}

export interface ReviewReport {
    reportedBy: string;
    reason: string;
    createdAt: Date;
}
