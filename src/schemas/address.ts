export interface Address {
  id: string;
  country: string;
  city: string;
  area: string;
  streetAddress: string;
  apartment?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  country: string;
  city: string;
  area: string;
  streetAddress: string;
  apartment?: string;
}

export interface UpdateAddressData {
  country?: string;
  city?: string;
  area?: string;
  streetAddress?: string;
  apartment?: string;
}

export interface PickedLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
}
