import { NextRequest, NextResponse } from 'next/server';
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
  updateCartBuyerIdentity,
} from '@/lib/shopify/client';

export async function GET(req: NextRequest) {
  try {
    const shouldReset = req.nextUrl.searchParams.get('reset') === 'true';
    let cartId = req.cookies.get('shopify_cart_id')?.value;
    const customerToken = req.cookies.get('shopify_customer_token')?.value;

    let cart;

    if (shouldReset) {
      cart = await createCart();
      cartId = cart.id;
    } else {
      cart = await getCart(cartId);
      if (!cart && !cartId) {
        cart = await createCart();
        cartId = cart.id;
      }
    }

    if (cart && customerToken && cartId) {
      cart = await updateCartBuyerIdentity(cartId, customerToken);
    }

    const response = NextResponse.json({ success: true, cart });
    if (cart?.id && cart.id !== cartId) {
      response.cookies.set('shopify_cart_id', cart.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }
    return response;
  } catch (error: any) {
    console.error('[Cart GET Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, merchandiseId, lineId, quantity = 1 } = body;

    let cartId = req.cookies.get('shopify_cart_id')?.value;
    const customerToken = req.cookies.get('shopify_customer_token')?.value;

    let updatedCart;

    if (action === 'clear') {
      updatedCart = await createCart();
    } else {
      if (!cartId) {
        const newCart = await createCart();
        cartId = newCart.id;
      }

      if (action === 'add' && merchandiseId) {
        updatedCart = await addToCart(cartId, [{ merchandiseId, quantity }]);
      } else if (action === 'update' && lineId) {
        updatedCart = await updateCart(cartId, [{ id: lineId, merchandiseId: merchandiseId || '', quantity }]);
      } else if (action === 'remove' && lineId) {
        updatedCart = await removeFromCart(cartId, [lineId]);
      } else {
        updatedCart = await getCart(cartId);
      }
    }

    if (updatedCart && customerToken && updatedCart.id) {
      updatedCart = await updateCartBuyerIdentity(updatedCart.id, customerToken);
    }

    const response = NextResponse.json({ success: true, cart: updatedCart });
    if (updatedCart?.id) {
      response.cookies.set('shopify_cart_id', updatedCart.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    return response;
  } catch (error: any) {
    console.error('[Cart POST Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const newCart = await createCart();
    const response = NextResponse.json({ success: true, cart: newCart });
    response.cookies.set('shopify_cart_id', newCart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    return response;
  } catch (error: any) {
    console.error('[Cart DELETE Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
