import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import Student from '@/models/students';
import Company from '@/models/companies';

export async function POST(req) {
    try {
        const { userType, email, password, ...rest } = await req.json();

        await connectToDatabase();

        const Model = userType === 'student' ? Student : Company;

        const existingUser = await Model.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'User already exists' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let userData = {
            email,
            password: hashedPassword,
            ...rest
        };

        // Calculate profile strength for both students and companies
        const fields = userType === 'student' 
            ? ['fullName', 'email', 'institution', 'fieldOfStudy', 'yearOfStudy', 'registrationNumber', 'profilePicture', 'course', 'skills', 'bio']
            : ['companyName', 'email', 'industry', 'description', 'logo', 'website', 'location', 'size'];

        const totalFields = fields.length;
        const filledFields = fields.filter(field => userData[field] && userData[field] !== '').length;

        userData.profileStrength = Math.round((filledFields / totalFields) * 100);

        const newUser = new Model(userData);
        await newUser.save();

        return new Response(JSON.stringify({
            message: 'User registered successfully',
            profileStrength: userData.profileStrength
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return new Response(JSON.stringify({ message: 'An error occurred during registration' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}