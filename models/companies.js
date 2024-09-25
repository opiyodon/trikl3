import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    industry: String,
    description: String,
    logo: String,
    website: String,
    location: String,
    size: Number,
    profileStrength: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);