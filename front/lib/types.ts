// Tipos base para el admin y la tienda

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'Argentine' | 'International' | 'Custom';
  team?: string;
  stock: number;
  sizes: string[];
  isOnSale: boolean;
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  options?: {
    customName?: string;
    customNumber?: string;
  };
};

export type Order = {
  id: string;
  createdAt: string;
  status: 'new' | 'paid' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  shipping: {
    zone: 'CABA' | 'GBA' | 'Interior';
    address: string;
    city: string;
    province: string;
  };
  paymentMethod: 'Mercado Pago' | 'Transfer';
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  notes?: string;
};

export type AnalyticsEvent = {
  type: 'product_view' | 'add_to_cart' | 'remove_from_cart' | 'purchase' | 'custom_quote_opened' | 'custom_quote_submitted' | 'contact_whatsapp_click' | 'search_used' | 'filter_used';
  ts: string;
  productId?: string;
  slug?: string;
  category?: string;
  payload?: any;
};

export type Settings = {
  whatsappPhone: string;
  storeAddress: string;
  shippingCosts: {
    CABA: number;
    GBA: number;
    Interior: number;
  };
  productionTime: string;
  businessHours: string;
};
