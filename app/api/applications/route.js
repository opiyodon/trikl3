import { connectToDatabase } from '@/lib/mongodb';
import Application from '@/models/application';
import nodemailer from 'nodemailer';

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
    const resumeFile = formData.get('resume');
    const coverLetterFile = formData.get('coverLetter');

    const resumeBase64 = await convertToBase64(resumeFile);
    const coverLetterBase64 = coverLetterFile ? await convertToBase64(coverLetterFile) : null;

    const applicationData = Object.fromEntries(formData);
    applicationData.resume = `data:${resumeFile.type};base64,${resumeBase64}`;
    if (coverLetterBase64) {
      applicationData.coverLetter = `data:${coverLetterFile.type};base64,${coverLetterBase64}`;
    }
    applicationData.jobDetails = JSON.parse(applicationData.jobDetails);

    const newApplication = new Application(applicationData);
    await newApplication.save();

    await sendEmailToCompany(applicationData);

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

// Handle DELETE request to delete an application
export async function DELETE(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    await Application.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: 'Application deleted successfully' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return new Response(JSON.stringify({ message: 'Failed to delete application' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

// Function to send an email to the company
async function sendEmailToCompany(applicationData) {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: process.env.NODEMAILER_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const mailOptions = {
    from: applicationData.email,
    to: applicationData.jobDetails.company,
    subject: `New Application for ${applicationData.jobDetails.title}`,
    html: `
      <h1>New Application Received</h1>
      <p>A student has applied for the position of ${applicationData.jobDetails.title} through Trikl3.</p>
      <p>Student Name: ${applicationData.studentName}</p>
      <p>Email: ${applicationData.email}</p>
      ${applicationData.jobDetails.isLocal ? `
        <p>You can view and manage this application by logging into your Trikl3 account:</p>
        <a href="https://trikl3.com/company-dashboard">View Application</a>
      ` : ''}
      <p>Resume and cover letter (if provided) are stored in the application details.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}