import { NextRequest, NextResponse } from 'next/server';
import { getCustomer } from '@/lib/shopify/client';

export async function GET(req: NextRequest) {
  try {
    let token = req.cookies.get('shopify_customer_token')?.value;

    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated.' }, { status: 401 });
    }

    const customer = await getCustomer(token);

    if (!customer) {
      const response = NextResponse.json({ success: false, error: 'Invalid or expired session.' }, { status: 401 });
      response.cookies.delete('shopify_customer_token');
      return response;
    }

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch (error: any) {
    console.error('[Me API Route Error]', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
