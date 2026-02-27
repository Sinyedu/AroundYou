export interface Event extends Document {
    eventID: string;
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
    isAnnual: boolean;
    startDate: Date;
    endDate: Date;
    openingHours: string[];
}