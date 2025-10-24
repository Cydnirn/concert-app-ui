export interface IConcert {
  id: number;
  name: string;
  details?: string;
  organizer: string;
  image: string;
  date: Date;
  price: number;
  venue: string;
  artist: string;
}
