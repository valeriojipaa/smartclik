import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ error: 'Use o catálogo interno em Meus produtos.' }, { status: 410 });
}
