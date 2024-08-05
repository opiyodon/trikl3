import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  institution: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  yearOfStudy: Number,
  registrationNumber: String,
  profilePicture: String,
  course: String,
  skills: [String],
  bio: String,
  profileStrength: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);