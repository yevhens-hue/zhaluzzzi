export interface ProductColor {
  id: string;
  name: string;
  code: string;
  hex: string;
  image?: string;
  inStock?: boolean;
}

export interface ProductCharacteristics {
  fabric?: string;
  texture?: string;
  color?: string;
  blackout?: string;
  system?: string;
  manufacturer?: string;
  warranty?: string;
  cassette?: string;
  guideRails?: string;
  material?: string;
  lamellaWidth?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  sku: string;
  category_slug: string;
  subcategory_slug?: string;
  base_price: number;
  old_price?: number;
  price_unit: string;
  min_width: number;
  max_width: number;
  min_height: number;
  max_height: number;
  base_width: number;
  base_height: number;
  price_per_sqm: number;
  fabric?: string;
  texture?: string;
  blackout_percent?: number;
  color_name?: string;
  color_hex?: string;
  available_colors: ProductColor[];
  main_image: string;
  images: string[];
  is_popular?: boolean;
  is_new?: boolean;
  is_offer_of_day?: boolean;
  in_stock: boolean;
  rating: number;
  reviews_count: number;
  destinations?: string[];
  description: string;
  characteristics: ProductCharacteristics;
  created_at?: string;
}

export interface Category {
  id: string;
  slug: string;
  title_ua: string;
  title_ru?: string;
  description_ua?: string;
  parent_id?: string;
  icon?: string;
  image_url?: string;
  sort_order?: number;
}

export interface CartItem {
  id: string; // unique item uuid in cart
  productId: string;
  slug: string;
  title: string;
  sku: string;
  image: string;
  width: number; // in cm
  height: number; // in cm
  color: ProductColor;
  controlSide: 'left' | 'right';
  fixationType: 'with_line' | 'without_line';
  mountingType?: 'on_sash' | 'in_opening' | 'on_wall';
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderItemPayload {
  productId: string;
  title: string;
  sku: string;
  width: number;
  height: number;
  color: string;
  controlSide: string;
  fixationType: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id?: string;
  order_number?: string;
  customer_name: string;
  phone: string;
  email?: string;
  city: string;
  delivery_type: string;
  delivery_address: string;
  payment_method: string;
  items: OrderItemPayload[];
  total_amount: number;
  comment?: string;
  status?: string;
  created_at?: string;
}

export interface Lead {
  id?: string;
  phone: string;
  name?: string;
  product_id?: string;
  product_title?: string;
  product_sku?: string;
  dimensions?: string;
  selected_color?: string;
  calculated_price?: number;
  lead_type?: 'one_click' | 'callback' | 'consultation';
  comment?: string;
  status?: string;
  created_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  author_name: string;
  city?: string;
  rating: number;
  comment: string;
  created_at: string;
}
