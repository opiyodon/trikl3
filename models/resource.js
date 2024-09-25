import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  duration: { type: String, required: true },
  companyEmail: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);