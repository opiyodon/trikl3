import { connectToDatabase } from '@/lib/mongodb';
import Student from '@/models/students';
import { NextResponse } from 'next/server';

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

    const formData = await request.formData();
    const email = formData.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const updateData = {};
    for (const [key, value] of formData.entries()) {
      if (value !== null && value !== undefined && value !== '' && key !== 'profilePicture') {
        updateData[key] = value;
      }
    }

    // Handle profile picture upload
    const file = formData.get('profilePicture');
    if (file && file instanceof Blob) {
      const buffer = await file.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString('base64');
      const imageFormat = file.type.split('/')[1];
      updateData.profilePicture = `data:${file.type};base64,${base64Image}`;
    }

    // Handle skills as array
    if (updateData.skills) {
      updateData.skills = updateData.skills.split(',').map(skill => skill.trim());
    }

    // Calculate profile strength
    const studentFields = [
      'fullName', 'email', 'institution', 'fieldOfStudy',
      'yearOfStudy', 'registrationNumber', 'profilePicture',
      'course', 'skills', 'bio'
    ];

    // Get the current user data
    const currentUser = await Student.findOne({ email });

    // Merge current user data with update data
    const mergedData = { ...currentUser.toObject(), ...updateData };

    // Calculate the total number of fields and how many are filled
    const totalFields = studentFields.length;
    const filledFields = studentFields.filter(field =>
      mergedData[field] && (Array.isArray(mergedData[field]) ? mergedData[field].length > 0 : mergedData[field] !== '')
    ).length;

    // Calculate the profile strength as a percentage
    updateData.profileStrength = Math.round((filledFields / totalFields) * 100);

    const updatedUser = await Student.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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

    // Here you should properly verify the password
    // This is just a placeholder, use a proper password hashing library in production
    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    await Student.findOneAndDelete({ email });

    return NextResponse.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}