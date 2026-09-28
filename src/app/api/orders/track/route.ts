import { NextRequest, NextResponse } from 'next/server';
import { getOrder } from '@/lib/shopify/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required.' }, { status: 400 });
    }

    let queryId = orderId.trim();
    if (!queryId.startsWith('gid://shopify/Order/')) {
      if (/^\d+$/.test(queryId)) {
        queryId = `gid://shopify/Order/${queryId}`;
      }
    }

    const order = await getOrder(queryId);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('[Track Order API Route Error]', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
