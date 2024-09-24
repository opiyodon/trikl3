import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  link: { type: String, required: true },
  tags: { type: String },
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
