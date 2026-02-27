export interface User extends Document {
    userID: string;
    firstName: string;
    lastName: string;
    userName: string;
    userAvatar: string;
    email: string;
    password: string;
    country: string;
    city: string;
    street: string;
    streetNumber: string;
    postalCode: string;
    isRestricted: boolean;
    createdAt: Date;
}