import { NextRequest, NextResponse } from 'next/server';
import { loginCustomer } from '@/lib/shopify/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    const loginRes = await loginCustomer({ email, password });

    if (!loginRes.success || !loginRes.data?.accessToken) {
      return NextResponse.json({ success: false, error: loginRes.error || 'Invalid email or password.' }, { status: 401 });
    }

    const token = loginRes.data.accessToken;
    const response = NextResponse.json({
      success: true,
      accessToken: token,
      expiresAt: loginRes.data.expiresAt,
    });

    response.cookies.set('shopify_customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('[Login API Route Error]', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
