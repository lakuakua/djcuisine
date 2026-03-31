/**
 * Easyship 2024-09 API types (rates).
 */

export interface EasyshipAddress {
  line_1: string;
  line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country_alpha2: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  company_name?: string;
}

export interface EasyshipItem {
  product?: { sku: string };
  actual_weight: number;
  declared_customs_value: number;
  declared_currency: string;
  dimensions: { length: number; width: number; height: number };
  quantity: number;
  origin_country_alpha2: string;
  category?: string;
  contains_liquids?: boolean;
}

export interface EasyshipParcel {
  items: EasyshipItem[];
}

export interface EasyshipRateRequest {
  origin_address: EasyshipAddress;
  destination_address: EasyshipAddress;
  parcels: EasyshipParcel[];
  shipping_settings?: {
    units?: { weight?: string; dimensions?: string };
  };
  courier_settings?: {
    show_courier_logo_url?: boolean;
    apply_shipping_rules?: boolean;
  };
  insurance?: { is_insured: boolean };
  incoterms?: string;
  output_currency?: string;
}

export interface EasyshipRate {
  courier_id?: string;
  courier_name?: string;
  courier_service?: {
    courier_id?: string;
    id?: string;
    name?: string;
    umbrella_name?: string;
  };
  min_delivery_time: number;
  max_delivery_time: number;
  total_charge: number;
  currency: string;
  full_description: string;
}

export interface EasyshipRatesResponse {
  rates: EasyshipRate[];
}
