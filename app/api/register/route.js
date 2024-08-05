import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import Student from '@/models/students';
import Company from '@/models/companies';

export async function POST(req) {
    try {
        // Parse the incoming request body
        const { userType, email, password, ...rest } = await req.json();

        // Connect to the MongoDB database
        await connectToDatabase();

        // Determine which model to use based on the userType
        const Model = userType === 'student' ? Student : Company;

        // Check if a user with the given email already exists
        const existingUser = await Model.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'User already exists' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare the user data object
        let userData = {
            email,
            password: hashedPassword,
            ...rest // Spread operator to include all other fields from the request
        };

        // If the user is a student, calculate the profile strength
        if (userType === 'student') {
            const studentFields = [
                'fullName', 'email', 'institution', 'fieldOfStudy',
                'yearOfStudy', 'registrationNumber', 'profilePicture',
                'course', 'skills', 'bio'
            ];

            // Calculate the total number of fields and how many are filled
            const totalFields = studentFields.length;
            const filledFields = studentFields.filter(field =>
                userData[field] && userData[field] !== ''
            ).length;

            // Calculate the profile strength as a percentage
            userData.profileStrength = Math.round((filledFields / totalFields) * 100);
        }

        // Create a new user document
        const newUser = new Model(userData);

        // Save the new user to the database
        await newUser.save();

        // Return a success response
        return new Response(JSON.stringify({
            message: 'User registered successfully',
            profileStrength: userData.profileStrength
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        // Log the error and return an error response
        console.error('Registration error:', error);
        return new Response(JSON.stringify({ message: 'An error occurred during registration' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}