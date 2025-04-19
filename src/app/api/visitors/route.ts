import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Visitor from '@/models/Visitor';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    const visitor = await Visitor.findOne();
    
    if (!visitor) {
      const newVisitor = await Visitor.create({ count: 1 });
      return NextResponse.json({ count: newVisitor.count });
    }

    return NextResponse.json({ count: visitor.count });
  } catch (error) {
    console.error('Error in GET /api/visitors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch view count' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    await connectDB();
    let visitor = await Visitor.findOne();
    
    if (!visitor) {
      visitor = await Visitor.create({ count: 1 });
    } else {
      visitor.count += 1;
      await visitor.save();
    }

    return NextResponse.json({ count: visitor.count });
  } catch (error) {
    console.error('Error in POST /api/visitors:', error);
    return NextResponse.json(
      { error: 'Failed to update view count' },
      { status: 500 }
    );
  }
} 