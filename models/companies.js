import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    companyName: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    industry: String,
    description: String,
    logo: String,
    website: String,
    location: String,
    size: String,
    profileCompleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);