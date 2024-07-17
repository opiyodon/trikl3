import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import Student from '@/models/students';
import Company from '@/models/companies';

export async function POST(req) {
    try {
        const { userType, email, password, ...rest } = await req.json();
        await connectToDatabase();

        // Check if user already exists
        const existingUser = await (userType === 'student' ? Student : Company).findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'User already exists' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new (userType === 'student' ? Student : Company)({
            email,
            password: hashedPassword,
            ...rest,
        });

        await newUser.save();

        return new Response(JSON.stringify({ message: 'User registered successfully' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'An error occurred during registration' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}