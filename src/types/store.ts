export type ApiStoreBanner = {
  id: string;
  photo: {
    id: string;
    url: string;
  };
};

export type ApiStore = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  working_hours: string;
  main_color?: string;
  secondary_color?: string;
  logo_url?: string;
  is_active?: boolean;
};

export type ApiStoresResponse = {
  success: boolean;
  data: ApiStore[];
  meta_data: {
    current_page: number;
    page_size: number;
    first_page: number;
    last_page: number;
    total_records: number;
  };
};
