import { connectToDatabase } from '@/lib/mongodb';
import Resource from '@/models/resource';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const companyEmail = searchParams.get('companyEmail');

    const resource = await Resource.findOne({ _id: id, companyEmail });

    if (!resource) {
      return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json({ message: 'Failed to fetch resource' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const updatedData = await request.json();

    const resource = await Resource.findByIdAndUpdate(id, updatedData, { new: true });

    if (!resource) {
      return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json({ message: 'Failed to update resource' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const resource = await Resource.findByIdAndDelete(id);

    if (!resource) {
      return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ message: 'Failed to delete resource' }, { status: 500 });
  }
}
