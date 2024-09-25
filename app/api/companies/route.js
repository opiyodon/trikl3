import { connectToDatabase } from '@/lib/mongodb';
import Company from '@/models/companies';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const company = await Company.findOne({ email });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const { password, ...companyData } = company.toObject();
    return NextResponse.json(companyData);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();

    const data = await request.json();
    const { email, ...updateData } = data;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const companyFields = [
      'companyName', 'email', 'industry', 'size', 'location',
      'website', 'description', 'logo'
    ];

    const company = await Company.findOne({ email });
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const updatedCompanyData = { ...company.toObject(), ...updateData };
    const totalFields = companyFields.length;
    const filledFields = companyFields.filter(field =>
      updatedCompanyData[field] && updatedCompanyData[field] !== ''
    ).length;

    updateData.profileStrength = Math.round((filledFields / totalFields) * 100);

    const updatedCompany = await Company.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    );

    const { password, ...sanitizedCompany } = updatedCompany.toObject();
    return NextResponse.json(sanitizedCompany);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const password = searchParams.get('password');

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const company = await Company.findOne({ email });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    await Company.findOneAndDelete({ email });

    return NextResponse.json({ message: 'Company account deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}