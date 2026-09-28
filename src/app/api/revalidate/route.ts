import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { TAGS } from '@/lib/shopify/constants';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.nextUrl.searchParams.get('secret');

  if (secret !== process.env.SHOPIFY_REVALIDATION_SECRET && secret !== 'demo-secret') {
    return NextResponse.json({ message: 'Invalid secret token' }, { status: 401 });
  }

  const topic = req.headers.get('x-shopify-topic') || 'products';

  try {
    // Revalidate paths & tags
    revalidatePath('/', 'layout');
    (revalidateTag as any)(TAGS.products);
    (revalidateTag as any)(TAGS.collections);
    return NextResponse.json({ revalidated: true, now: Date.now(), topic });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
