import { connectToDatabase } from '@/lib/mongodb';
import Application from '@/models/application';

export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const jobId = searchParams.get('jobId');

  try {
    const existingApplication = await Application.findOne({
      studentEmail: email,
      'jobDetails.url': jobId
    });

    return new Response(JSON.stringify({ hasApplied: !!existingApplication }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error checking application status:', error);
    return new Response(JSON.stringify({ message: 'Failed to check application status' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}