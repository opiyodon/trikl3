import { connectToDatabase } from '@/lib/mongodb';
import Resource from '@/models/resource';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const companyEmail = searchParams.get('companyEmail');

    let query = {};
    if (companyEmail) {
      query.companyEmail = companyEmail;
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });

    if (resources.length === 0) {
      return new Response(JSON.stringify({ message: 'No resources found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(resources), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch resources' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(req) {
  try {
    const { companyName, position, location, description, requirements, duration, companyEmail } = await req.json();
    await connectToDatabase();

    const newResource = new Resource({
      companyName,
      position,
      location,
      description,
      requirements,
      duration,
      companyEmail
    });

    const savedResource = await newResource.save();
    return new Response(JSON.stringify(savedResource), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    return new Response(JSON.stringify({ message: 'Failed to create resource' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}