import { SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from './constants';
import { getCollectionProductsQuery, getCollectionQuery, getCollectionsQuery } from './queries/collection';
import { getProductQuery, getProductRecommendationsQuery, getProductsQuery } from './queries/product';
import { getCartQuery } from './queries/cart';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import { getCustomerQuery } from './queries/customer';
import { getOrderQuery } from './queries/order';
import { addToCartMutation, createCartMutation, editCartItemsMutation, removeFromCartMutation, updateCartBuyerIdentityMutation } from './mutations/cart';
import { createCustomerAccessTokenMutation, createCustomerMutation, deleteCustomerAccessTokenMutation, renewCustomerAccessTokenMutation } from './mutations/customer';
import { MOCK_COLLECTIONS, MOCK_PRODUCTS, MOCK_CART } from './mockData';
import {
  APIResponse,
  Cart,
  Collection,
  Customer,
  CustomerAccessToken,
  CustomerAccessTokenCreateInput,
  CustomerCreateInput,
  Menu,
  Order,
  Page,
  Product,
  ShopifyFetchParams,
  ShopifyFetchResult,
} from './types';

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? process.env.SHOPIFY_STORE_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '')
  : '';

const endpoint = domain ? `https://${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}` : '';
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN || '';

let memoryCart: Cart = JSON.parse(JSON.stringify(MOCK_CART));

export async function shopifyFetch<T>({
  query,
  variables,
  headers,
  cache = 'force-cache',
  tags,
}: ShopifyFetchParams<unknown>): Promise<ShopifyFetchResult<T>> {
  if (!endpoint || !key) {
    return {
      status: 200,
      body: { data: {} as T },
    };
  }

  try {
    const customHeaders = (headers as Record<string, string>) || {};
    const tokenHeaders: Record<string, string> = {};

    if (key.startsWith('shpat_')) {
      tokenHeaders['Shopify-Storefront-Private-Token'] = key;
    } else {
      tokenHeaders['X-Shopify-Storefront-Access-Token'] = key;
    }

    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...tokenHeaders,
        ...customHeaders,
      },
      cache,
      ...(tags && { next: { tags } }),
      body: JSON.stringify({
        ...(query ? { query } : {}),
        ...(variables ? { variables } : {}),
      }),
    });

    const body = await result.json();

    if (body.errors) {
      console.warn('[Shopify API Warning]', body.errors);
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    console.error('[Shopify API Error]', error);
    return {
      status: 500,
      body: { data: {} as T, errors: [{ message: (error as Error).message }] },
    };
  }
}

// Helper transformers for raw GraphQL response shapes
function reshapeProduct(product: any): Product | undefined {
  if (!product) return undefined;
  const { variants, images, ...rest } = product;

  return {
    ...rest,
    images: images?.edges?.map((edge: any) => edge.node) || [],
    variants: variants?.edges?.map((edge: any) => edge.node) || [],
  };
}

function reshapeProducts(products: any[]): Product[] {
  return products.map((item) => reshapeProduct(item)).filter((p): p is Product => p !== undefined);
}

function reshapeCollection(collection: any): Collection | undefined {
  if (!collection) return undefined;
  return {
    ...collection,
    path: `/collections/${collection.handle}`,
  };
}

function reshapeCart(cart: any): Cart {
  if (!cart) {
    return (
      memoryCart || {
        id: `cart-${Date.now()}`,
        checkoutUrl: '#',
        subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
        totalAmount: { amount: '0.00', currencyCode: 'USD' },
        totalTax: { amount: '0.00', currencyCode: 'USD' },
        totalQuantity: 0,
        lines: [],
      }
    );
  }

  const lines =
    cart.lines?.edges?.map((edge: any) => {
      const node = edge.node;
      return {
        id: node.id,
        quantity: node.quantity,
        cost: node.cost,
        merchandise: {
          ...node.merchandise,
          product: reshapeProduct(node.merchandise.product),
        },
      };
    }) || [];

  return {
    ...cart,
    subtotalAmount: cart.cost?.subtotalAmount || { amount: '0.00', currencyCode: 'USD' },
    totalAmount: cart.cost?.totalAmount || { amount: '0.00', currencyCode: 'USD' },
    totalTax: cart.cost?.checkoutChargeAmount || { amount: '0.00', currencyCode: 'USD' },
    lines,
  };
}

function reshapeOrder(node: any): Order | undefined {
  if (!node) return undefined;

  const lineItems =
    node.lineItems?.edges?.map((edge: any) => ({
      title: edge.node.title,
      quantity: edge.node.quantity,
      originalTotalPrice: edge.node.originalTotalPrice,
      variant: edge.node.variant,
    })) || [];

  return {
    id: node.id,
    name: node.name,
    orderNumber: node.orderNumber,
    processedAt: node.processedAt,
    financialStatus: node.financialStatus,
    fulfillmentStatus: node.fulfillmentStatus,
    statusUrl: node.statusUrl,
    totalPrice: node.totalPrice,
    subtotalPrice: node.subtotalPrice,
    totalTax: node.totalTax,
    shippingAddress: node.shippingAddress,
    lineItems,
    successfulFulfillments: node.successfulFulfillments || [],
  };
}

// Client Exported Functions — Real Shopify Storefront API Data with Rich Fallbacks

export async function getProduct(handle: string): Promise<Product | undefined> {
  if (!handle) return undefined;

  const res = await shopifyFetch<{ product: any }>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: { handle },
  });

  if (res.body.data?.product) {
    return reshapeProduct(res.body.data.product);
  }

  return MOCK_PRODUCTS.find((p) => p.handle === handle) || MOCK_PRODUCTS[0];
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  limit = 20,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  limit?: number;
} = {}): Promise<Product[]> {
  const res = await shopifyFetch<{ products: { edges: Array<{ node: any }> } }>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query: query || null,
      reverse: reverse || false,
      sortKey:
        sortKey === 'BEST_SELLING'
          ? 'BEST_SELLING'
          : sortKey === 'CREATED_AT'
          ? 'CREATED_AT'
          : sortKey === 'PRICE'
          ? 'PRICE'
          : 'RELEVANCE',
      first: limit,
    },
  });

  if (res.body.data?.products?.edges && res.body.data.products.edges.length > 0) {
    return reshapeProducts(res.body.data.products.edges.map((edge) => edge.node));
  }

  let products = [...MOCK_PRODUCTS];
  if (query) {
    const q = query.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (sortKey === 'PRICE') {
    products.sort((a, b) =>
      reverse
        ? parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
        : parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
    );
  }
  return products.slice(0, limit);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  if (!productId) return MOCK_PRODUCTS.slice(0, 4);

  const res = await shopifyFetch<{ productRecommendations: any[] }>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: { productId },
  });

  if (res.body.data?.productRecommendations && res.body.data.productRecommendations.length > 0) {
    return reshapeProducts(res.body.data.productRecommendations);
  }

  return MOCK_PRODUCTS.filter((p) => p.id !== productId).slice(0, 4);
}

export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<{ collections: { edges: Array<{ node: any }> } }>({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
  });

  if (res.body.data?.collections?.edges && res.body.data.collections.edges.length > 0) {
    return res.body.data.collections.edges
      .map((edge) => reshapeCollection(edge.node))
      .filter((c): c is Collection => c !== undefined);
  }

  return MOCK_COLLECTIONS;
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  if (!handle) return undefined;

  const res = await shopifyFetch<{ collection: any }>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: { handle },
  });

  if (res.body.data?.collection) {
    return reshapeCollection(res.body.data.collection);
  }

  return MOCK_COLLECTIONS.find((c) => c.handle === handle) || MOCK_COLLECTIONS[0];
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  if (!collection) return MOCK_PRODUCTS;

  const res = await shopifyFetch<{ collection: { products: { edges: Array<{ node: any }> } } }>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse: reverse || false,
      sortKey: sortKey === 'PRICE' ? 'PRICE' : sortKey === 'BEST_SELLING' ? 'BEST_SELLING' : 'COLLECTION_DEFAULT',
    },
  });

  if (res.body.data?.collection?.products?.edges && res.body.data.collection.products.edges.length > 0) {
    return reshapeProducts(res.body.data.collection.products.edges.map((edge) => edge.node));
  }

  const filtered = MOCK_PRODUCTS.filter(
    (p) => p.category === collection || p.tags.includes(collection) || p.handle.includes(collection)
  );

  return filtered.length > 0 ? filtered : MOCK_PRODUCTS;
}

export async function getCart(cartId?: string): Promise<Cart | undefined> {
  if (cartId && !cartId.startsWith('cart-')) {
    const res = await shopifyFetch<{ cart: any }>({
      query: getCartQuery,
      tags: [TAGS.cart],
      variables: { cartId },
      cache: 'no-store',
    });

    if (res.body.data?.cart) {
      return reshapeCart(res.body.data.cart);
    }
  }

  return memoryCart;
}

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<{ cartCreate: { cart: any } }>({
    query: createCartMutation,
    cache: 'no-store',
  });

  if (res.body.data?.cartCreate?.cart) {
    return reshapeCart(res.body.data.cartCreate.cart);
  }

  memoryCart = {
    id: `cart-${Date.now()}`,
    checkoutUrl: '#checkout',
    subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
    totalAmount: { amount: '0.00', currencyCode: 'USD' },
    totalTax: { amount: '0.00', currencyCode: 'USD' },
    totalQuantity: 0,
    lines: [],
  };

  return memoryCart;
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<Cart> {
  if (cartId && !cartId.startsWith('cart-')) {
    const res = await shopifyFetch<{ cartLinesAdd: { cart: any } }>({
      query: addToCartMutation,
      variables: { cartId, lines },
      cache: 'no-store',
    });

    if (res.body.data?.cartLinesAdd?.cart) {
      return reshapeCart(res.body.data.cartLinesAdd.cart);
    }
  }

  // Fallback memory cart handler
  lines.forEach((line) => {
    // Find variant across mock products
    let foundProduct: Product | undefined;
    let foundVariant: any;

    for (const prod of MOCK_PRODUCTS) {
      const v = prod.variants.find((v) => v.id === line.merchandiseId);
      if (v) {
        foundProduct = prod;
        foundVariant = v;
        break;
      }
    }

    if (!foundProduct || !foundVariant) {
      // Default to first product if merchandise ID not matched exactly
      foundProduct = MOCK_PRODUCTS[0];
      foundVariant = MOCK_PRODUCTS[0].variants[0];
    }

    const existingIndex = memoryCart.lines.findIndex((l) => l.merchandise.id === foundVariant.id);
    if (existingIndex > -1) {
      memoryCart.lines[existingIndex].quantity += line.quantity;
      const unitPrice = parseFloat(foundVariant.price.amount);
      memoryCart.lines[existingIndex].cost = {
        totalAmount: {
          amount: (unitPrice * memoryCart.lines[existingIndex].quantity).toFixed(2),
          currencyCode: foundVariant.price.currencyCode,
        },
      };
    } else {
      memoryCart.lines.push({
        id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        quantity: line.quantity,
        cost: {
          totalAmount: {
            amount: (parseFloat(foundVariant.price.amount) * line.quantity).toFixed(2),
            currencyCode: foundVariant.price.currencyCode,
          },
        },
        merchandise: {
          id: foundVariant.id,
          title: foundVariant.title,
          selectedOptions: foundVariant.selectedOptions,
          price: foundVariant.price,
          image: foundVariant.image || foundProduct.featuredImage,
          product: foundProduct,
        },
      });
    }
  });

  recalculateMemoryCart();
  return memoryCart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  if (cartId && !cartId.startsWith('cart-')) {
    const res = await shopifyFetch<{ cartLinesRemove: { cart: any } }>({
      query: removeFromCartMutation,
      variables: { cartId, lineIds },
      cache: 'no-store',
    });

    if (res.body.data?.cartLinesRemove?.cart) {
      return reshapeCart(res.body.data.cartLinesRemove.cart);
    }
  }

  memoryCart.lines = memoryCart.lines.filter((l) => !lineIds.includes(l.id));
  recalculateMemoryCart();
  return memoryCart;
}

export async function updateCart(
  cartId: string,
  lines: Array<{ id: string; merchandiseId: string; quantity: number }>
): Promise<Cart> {
  if (cartId && !cartId.startsWith('cart-')) {
    const res = await shopifyFetch<{ cartLinesUpdate: { cart: any } }>({
      query: editCartItemsMutation,
      variables: { cartId, lines },
      cache: 'no-store',
    });

    if (res.body.data?.cartLinesUpdate?.cart) {
      return reshapeCart(res.body.data.cartLinesUpdate.cart);
    }
  }

  lines.forEach((item) => {
    const lineIndex = memoryCart.lines.findIndex((l) => l.id === item.id);
    if (lineIndex > -1) {
      if (item.quantity <= 0) {
        memoryCart.lines.splice(lineIndex, 1);
      } else {
        memoryCart.lines[lineIndex].quantity = item.quantity;
        const unitPrice = parseFloat(memoryCart.lines[lineIndex].merchandise.price.amount);
        memoryCart.lines[lineIndex].cost = {
          totalAmount: {
            amount: (unitPrice * item.quantity).toFixed(2),
            currencyCode: memoryCart.lines[lineIndex].merchandise.price.currencyCode,
          },
        };
      }
    }
  });

  recalculateMemoryCart();
  return memoryCart;
}

function recalculateMemoryCart() {
  let subtotal = 0;
  let totalQty = 0;

  memoryCart.lines.forEach((line) => {
    subtotal += parseFloat(line.cost.totalAmount.amount);
    totalQty += line.quantity;
  });

  memoryCart.totalQuantity = totalQty;
  memoryCart.subtotalAmount = { amount: subtotal.toFixed(2), currencyCode: 'USD' };
  memoryCart.totalAmount = { amount: (subtotal * 1.08).toFixed(2), currencyCode: 'USD' }; // +8% tax/shipping
  memoryCart.totalTax = { amount: (subtotal * 0.08).toFixed(2), currencyCode: 'USD' };
}

export async function updateCartBuyerIdentity(
  cartId: string,
  customerAccessToken: string
): Promise<Cart> {
  if (!cartId || !customerAccessToken) {
    return (await getCart(cartId)) || (await createCart());
  }

  const res = await shopifyFetch<{ cartBuyerIdentityUpdate: { cart: any } }>({
    query: updateCartBuyerIdentityMutation,
    variables: {
      cartId,
      buyerIdentity: {
        customerAccessToken,
      },
    },
    cache: 'no-store',
  });

  if (res.body.data?.cartBuyerIdentityUpdate?.cart) {
    return reshapeCart(res.body.data.cartBuyerIdentityUpdate.cart);
  }

  return (await getCart(cartId)) || (await createCart());
}

// Customer Account & Authentication API Handlers

export async function createCustomer(input: CustomerCreateInput): Promise<APIResponse<Customer>> {
  const res = await shopifyFetch<{
    customerCreate: {
      customer: any;
      customerUserErrors: Array<{ message: string; field: string[] }>;
    };
  }>({
    query: createCustomerMutation,
    variables: { input },
    cache: 'no-store',
  });

  const errors = res.body.data?.customerCreate?.customerUserErrors;
  if (errors && errors.length > 0) {
    return {
      success: false,
      error: errors.map((e) => e.message).join(', '),
    };
  }

  const customer = res.body.data?.customerCreate?.customer;
  if (customer) {
    return {
      success: true,
      data: {
        id: customer.id,
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email,
        acceptsMarketing: customer.acceptsMarketing,
      },
    };
  }

  return { success: false, error: 'Failed to create customer account.' };
}

export async function loginCustomer(
  input: CustomerAccessTokenCreateInput
): Promise<APIResponse<CustomerAccessToken>> {
  const res = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: CustomerAccessToken;
      customerUserErrors: Array<{ message: string }>;
    };
  }>({
    query: createCustomerAccessTokenMutation,
    variables: { input },
    cache: 'no-store',
  });

  const errors = res.body.data?.customerAccessTokenCreate?.customerUserErrors;
  if (errors && errors.length > 0) {
    return {
      success: false,
      error: errors.map((e) => e.message).join(', '),
    };
  }

  const token = res.body.data?.customerAccessTokenCreate?.customerAccessToken;
  if (token) {
    return {
      success: true,
      data: token,
    };
  }

  return { success: false, error: 'Invalid email or password.' };
}

export async function getCustomer(customerAccessToken: string): Promise<Customer | undefined> {
  if (!customerAccessToken) return undefined;

  const res = await shopifyFetch<{ customer: any }>({
    query: getCustomerQuery,
    variables: { customerAccessToken },
    cache: 'no-store',
  });

  const c = res.body.data?.customer;
  if (!c) return undefined;

  const addresses = c.addresses?.edges?.map((e: any) => e.node) || [];
  const orders = c.orders?.edges?.map((e: any) => reshapeOrder(e.node)).filter((o: Order | undefined): o is Order => o !== undefined) || [];

  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    acceptsMarketing: c.acceptsMarketing,
    defaultAddress: c.defaultAddress,
    addresses,
    orders,
  };
}

export async function renewCustomerAccessToken(
  customerAccessToken: string
): Promise<CustomerAccessToken | undefined> {
  const res = await shopifyFetch<{
    customerAccessTokenRenew: { customerAccessToken: CustomerAccessToken };
  }>({
    query: renewCustomerAccessTokenMutation,
    variables: { customerAccessToken },
    cache: 'no-store',
  });

  return res.body.data?.customerAccessTokenRenew?.customerAccessToken;
}

export async function deleteCustomerAccessToken(customerAccessToken: string): Promise<boolean> {
  const res = await shopifyFetch<{
    customerAccessTokenDelete: { deletedAccessToken: string };
  }>({
    query: deleteCustomerAccessTokenMutation,
    variables: { customerAccessToken },
    cache: 'no-store',
  });

  return !!res.body.data?.customerAccessTokenDelete?.deletedAccessToken;
}

// Order Tracking API Handlers

export async function getOrder(orderId: string): Promise<Order | undefined> {
  if (!orderId) return undefined;

  const res = await shopifyFetch<{ node: any }>({
    query: getOrderQuery,
    variables: { id: orderId },
    cache: 'no-store',
  });

  if (res.body.data?.node) {
    return reshapeOrder(res.body.data.node);
  }

  return undefined;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<{ menu: { items: Array<{ title: string; url: string }> } }>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: { handle },
  });

  if (res.body.data?.menu?.items) {
    return res.body.data.menu.items;
  }

  return [
    { title: 'Home', url: '/' },
    { title: 'All Products', url: '/search' },
    { title: 'Track Order', url: '/orders/track' },
    { title: 'Account', url: '/account' },
  ];
}

export async function getPage(handle: string): Promise<Page | undefined> {
  if (!handle) return undefined;

  const res = await shopifyFetch<{ pageByHandle: Page }>({
    query: getPageQuery,
    variables: { handle },
  });

  if (res.body.data?.pageByHandle) {
    return res.body.data.pageByHandle;
  }

  return undefined;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<{ pages: { edges: Array<{ node: Page }> } }>({
    query: getPagesQuery,
  });

  if (res.body.data?.pages?.edges) {
    return res.body.data.pages.edges.map((edge) => edge.node);
  }

  return [];
}
