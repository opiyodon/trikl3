import { connectToDatabase } from '@/lib/mongodb';
import Attachment from '@/models/attachment';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const companyEmail = searchParams.get('companyEmail');

    const attachment = await Attachment.findOne({ _id: id, companyEmail });

    if (!attachment) {
      return NextResponse.json({ message: 'Attachment not found' }, { status: 404 });
    }

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('Error fetching attachment:', error);
    return NextResponse.json({ message: 'Failed to fetch attachment' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const updatedData = await request.json();

    const attachment = await Attachment.findByIdAndUpdate(id, updatedData, { new: true });

    if (!attachment) {
      return NextResponse.json({ message: 'Attachment not found' }, { status: 404 });
    }

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('Error updating attachment:', error);
    return NextResponse.json({ message: 'Failed to update attachment' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const attachment = await Attachment.findByIdAndDelete(id);

    if (!attachment) {
      return NextResponse.json({ message: 'Attachment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    return NextResponse.json({ message: 'Failed to delete attachment' }, { status: 500 });
  }
}
