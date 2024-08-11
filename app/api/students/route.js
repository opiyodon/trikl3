import { connectToDatabase } from '@/lib/mongodb';
import Student from '@/models/students';
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
    const user = await Student.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
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

    // Handle skills as array
    if (updateData.skills) {
      updateData.skills = updateData.skills.map(skill => skill.trim()).filter(skill => skill !== '');
    }

    // Calculate the new profile strength
    const studentFields = [
      'fullName', 'email', 'institution', 'fieldOfStudy',
      'yearOfStudy', 'registrationNumber', 'profilePicture',
      'course', 'skills', 'bio'
    ];

    const user = await Student.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUserData = { ...user.toObject(), ...updateData };
    const totalFields = studentFields.length;
    const filledFields = studentFields.filter(field =>
      updatedUserData[field] && updatedUserData[field] !== ''
    ).length;

    updateData.profileStrength = Math.round((filledFields / totalFields) * 100);

    const updatedUser = await Student.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
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
    const user = await Student.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Delete the user
    await Student.findOneAndDelete({ email });

    return NextResponse.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}