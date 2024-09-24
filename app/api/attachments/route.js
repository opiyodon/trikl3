import { connectToDatabase } from '@/lib/mongodb';
import Attachment from '@/models/attachment';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const companyEmail = searchParams.get('companyEmail');

    let query = {};
    if (companyEmail) {
      query.companyEmail = companyEmail;
    }

    const attachments = await Attachment.find(query).sort({ createdAt: -1 });
    
    if (attachments.length === 0) {
      return new Response(JSON.stringify({ message: 'No attachments found' }), { 
        status: 404, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    return new Response(JSON.stringify(attachments), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Error fetching attachments:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch attachments' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}

export async function POST(req) {
  try {
    const { companyName, position, location, description, requirements, duration, companyEmail } = await req.json();
    await connectToDatabase();

    const newAttachment = new Attachment({
      companyName,
      position,
      location,
      description,
      requirements,
      duration,
      companyEmail
    });

    const savedAttachment = await newAttachment.save();
    return new Response(JSON.stringify(savedAttachment), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Error creating attachment:', error);
    return new Response(JSON.stringify({ message: 'Failed to create attachment' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}