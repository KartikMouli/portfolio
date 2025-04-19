import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Visitor from '@/models/Visitor';

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
    return NextResponse.json({ error: 'Failed to fetch visitor count' }, { status: 500 });
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
    return NextResponse.json({ error: 'Failed to update visitor count' }, { status: 500 });
  }
} 