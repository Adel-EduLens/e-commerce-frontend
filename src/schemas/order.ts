export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderItem {
  id: string;
  productId: string;
  product?: string;
  title?: string;
  name?: string;
  price: number | string;
  quantity: number;
  subtotal?: string | number;
  image?: string;
  imageSrc?: string;
  size?: string | null;
  color?: string | null;
  productType?: string;
}

export interface Order {
  id: string;
  orderId: string;
  orderType?: string;
  customer: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  mapAddress?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  date: string;
  time?: string;
  createdAt?: string;
  total: number | string;
  subtotal?: number | string;
  shipping?: number | string;
  discount?: number | string;
  couponCode?: string | null;
  status: OrderStatus | string;
  payment?: string;
  items: OrderItem[];
}

export type TraderOrder = Order;

export interface WholesaleOrderItem {
  id: string;
  productId: string;
  product: string;
  quantity: number;
  price: string;
  subtotal: string;
  size: string | null;
  color: string | null;
  image: string;
}

export interface WholesaleOrder {
  id: string;
  orderId: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  mapAddress: string | null;
  latitude: string | null;
  longitude: string | null;
  date: string;
  time: string;
  payment: string;
  total: string;
  subtotal: string;
  shipping: string;
  discount: string;
  status: string;
  items: WholesaleOrderItem[];
  createdAt?: string;
  couponCode?: string | null;
}

export interface TraderCustomer {
  email: string;
  name: string;
  phone: string | null;
  orders: number;
  totalSpent: string;
  lastPurchase: string;
}
