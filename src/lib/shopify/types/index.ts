export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Image {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface SEO {
  title: string;
  description: string;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image?: Image | null;
  sku?: string;
}

export interface Product {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: ProductVariant[];
  featuredImage: Image;
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
  vendor?: string;
  category?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
  path: string;
  image?: Image;
}

export interface CartItem {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    product: Product;
    price: Money;
    image?: Image;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  subtotalAmount: Money;
  totalAmount: Money;
  totalTax: Money;
  totalQuantity: number;
  lines: CartItem[];
}

export interface Menu {
  title: string;
  url: string;
}

export interface Page {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo: SEO;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  id?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  country: string;
  zip: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  acceptsMarketing: boolean;
  defaultAddress?: CustomerAddress;
  addresses?: CustomerAddress[];
  orders?: Order[];
}

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

export interface FulfillmentTrackingInfo {
  number?: string;
  url?: string;
  company?: string;
}

export interface SuccessfulFulfillment {
  trackingCompany?: string;
  trackingInfo?: FulfillmentTrackingInfo[];
}

export interface OrderLineItem {
  title: string;
  quantity: number;
  originalTotalPrice: Money;
  variant?: {
    id: string;
    title: string;
    image?: Image;
    price: Money;
  };
}

export interface Order {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: Money;
  subtotalPrice?: Money;
  totalTax?: Money;
  shippingAddress?: CustomerAddress;
  lineItems: OrderLineItem[];
  successfulFulfillments?: SuccessfulFulfillment[];
  statusUrl?: string;
}

export interface CustomerCreateInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
}

export interface CustomerAccessTokenCreateInput {
  email: string;
  password: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ShopifyFetchParams<TVariables> {
  query: string;
  variables?: TVariables;
  headers?: HeadersInit;
  cache?: RequestCache;
  tags?: string[];
}

export interface ShopifyFetchResult<TData> {
  status: number;
  body: {
    data: TData;
    errors?: Array<{ message: string; locations?: any[]; path?: string[] }>;
  };
}

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
  reverse: boolean;
};
