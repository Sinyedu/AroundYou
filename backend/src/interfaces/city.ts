export interface City extends Document {
  cityID: string;
  name: string;
  description: string;
  heroImage: string;
  commune: string;
  region: string;
  country: string;
  gpsPosition: string;
  population: number;
  visitorCenter: string;
}
