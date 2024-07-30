import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import Student from '@/models/students';
import Company from '@/models/companies';

export async function POST(req) {
    try {
        const { userType, email, password, ...rest } = await req.json();
        await connectToDatabase();

        // Determine the model based on userType
        const Model = userType === 'student' ? Student : Company;

        // Check if user already exists
        const existingUser = await Model.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'User already exists' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Model({
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