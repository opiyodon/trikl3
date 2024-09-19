import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  studentId: { type: String, required: true },
  course: { type: String, required: true },
  yearOfStudy: { type: String, required: true },
  city: { type: String, required: true },
  county: { type: String, required: true },
  country: { type: String, required: true },
  resume: { type: String, required: true },
  coverLetter: { type: String },
  linkedinProfile: { type: String },
  portfolioWebsite: { type: String },
  preferredAttachmentPeriod: { type: String, required: true },
  skills: { type: String },
  relevantCoursework: { type: String },
  additionalInformation: { type: String },
  agreeToTerms: { type: Boolean, required: true },
  status: { type: String, required: true, default: 'Pending' },
  jobDetails: {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    isLocal: { type: Boolean, required: true },
    url: { type: String },
    logoUrl: { type: String },
  },
  studentEmail: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);