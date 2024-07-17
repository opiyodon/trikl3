import { connectToDatabase } from '@/lib/mongodb';
import Student from '@/models/students';
import Company from '@/models/companies';

export async function POST(req) {
    try {
        const { email } = await req.json();
        await connectToDatabase();

        const studentExists = await Student.findOne({ email }).select('_id');
        const companyExists = await Company.findOne({ email }).select('_id');

        return new Response(JSON.stringify({ exists: !!(studentExists || companyExists) }), {
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