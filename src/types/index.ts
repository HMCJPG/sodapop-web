export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    city: string;
  };
  imageUrl: string;
  description: string;
  category?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  createdEventIds: string[];
  savedEventIds: string[];
  passedEventIds: string[];
}
