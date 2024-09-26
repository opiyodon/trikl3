import { connectToDatabase } from '@/lib/mongodb';
import Application from '@/models/application';

// Helper function to convert file to base64
async function convertToBase64(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}

// Handle GET request to retrieve applications
export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const companyName = searchParams.get('companyName');

  let applications;
  if (email) {
    applications = await Application.find({ studentEmail: email });
  } else if (companyName) {
    applications = await Application.find({ 'jobDetails.company': companyName });
  } else {
    applications = await Application.find({});
  }

  return new Response(JSON.stringify(applications), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

// Handle POST request to submit a new application
export async function POST(req) {
  await connectToDatabase();
  const formData = await req.formData();

  try {
    const applicationData = Object.fromEntries(formData);

    // Handle file uploads
    const resumeFile = formData.get('resume');
    const coverLetterFile = formData.get('coverLetter');

    if (resumeFile) {
      applicationData.resume = `data:${resumeFile.type};base64,${await convertToBase64(resumeFile)}`;
    }

    if (coverLetterFile) {
      applicationData.coverLetter = `data:${coverLetterFile.type};base64,${await convertToBase64(coverLetterFile)}`;
    }

    applicationData.jobDetails = JSON.parse(applicationData.jobDetails);

    const newApplication = new Application(applicationData);
    await newApplication.save();

    return new Response(JSON.stringify({ message: 'Application submitted successfully' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return new Response(JSON.stringify({ message: 'Failed to submit application' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

// Handle PUT request to update application status
export async function PUT(req) {
  await connectToDatabase();
  const { id, status } = await req.json();

  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return new Response(JSON.stringify({ message: 'Application not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: 'Application status updated successfully', application: updatedApplication }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return new Response(JSON.stringify({ message: 'Failed to update application status' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}