import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    institution: String,
    fieldOfStudy: String,
    yearOfStudy: Number,
    registrationNumber: String,
    profilePicture: String,
    course: String,
    profileCompleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);