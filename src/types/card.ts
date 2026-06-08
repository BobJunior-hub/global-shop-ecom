export type ApiCard = {
  id: string;
  created_at: string;
  updated_at: string;
  number: string;
  store_id: string;
  store: {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
  };
};

export type ApiCardsResponse = {
  success: boolean;
  data: ApiCard[];
  meta_data: {
    current_page: number;
    page_size: number;
    first_page: number;
    last_page: number;
    total_records: number;
  };
};

export type ApiCardResponse = {
  success: boolean;
  data: ApiCard;
};
