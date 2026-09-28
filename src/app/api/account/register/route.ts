import { NextRequest, NextResponse } from 'next/server';
import { createCustomer, loginCustomer } from '@/lib/shopify/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, acceptsMarketing } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    // 1. Create Customer in Shopify
    const createRes = await createCustomer({
      firstName,
      lastName,
      email,
      password,
      acceptsMarketing: !!acceptsMarketing,
    });

    if (!createRes.success) {
      return NextResponse.json({ success: false, error: createRes.error }, { status: 400 });
    }

    // 2. Automatically log in to get access token
    const loginRes = await loginCustomer({ email, password });
    let token = '';
    if (loginRes.success && loginRes.data?.accessToken) {
      token = loginRes.data.accessToken;
    }

    const response = NextResponse.json({
      success: true,
      customer: createRes.data,
      accessToken: token,
    });

    if (token) {
      response.cookies.set('shopify_customer_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    return response;
  } catch (error: any) {
    console.error('[Register API Route Error]', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
