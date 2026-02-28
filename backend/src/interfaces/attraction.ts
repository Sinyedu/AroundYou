export interface Attraction extends Document {
    attractionID: string;
    name: string;
    description: string;
    heroImage: string;
    imageArray: string[];
    price: number;
    link: string;
    gpsPosition: string;
    rating: number;
    slugArray: string[];
    updateAt: Date;
    openingHours: string[];
}