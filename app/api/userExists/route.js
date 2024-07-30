import { connectToDatabase } from '@/lib/mongodb';
import Student from '@/models/students';
import Company from '@/models/companies';

export async function POST(req) {
    try {
        const { email, userType } = await req.json();
        await connectToDatabase();

        const Model = userType === 'student' ? Student : Company;
        const userExists = await Model.findOne({ email }).select('_id');

        return new Response(JSON.stringify({ exists: !!userExists }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'An error occurred' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}