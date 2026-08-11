export interface ShippingCity {
  id: string;
  name: string;
  shippingCost: number;
  countryId: string;
  country?: ShippingCountry;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingCountry {
  id: string;
  name: string;
  code?: string | null;
  cities?: ShippingCity[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateShippingCountryData {
  name: string;
  code?: string;
}

export interface UpdateShippingCountryData {
  name?: string;
  code?: string;
}

export interface CreateShippingCityData {
  name: string;
  shippingCost?: number;
  countryId: string;
}

export interface UpdateShippingCityData {
  name?: string;
  shippingCost?: number;
  countryId?: string;
}
