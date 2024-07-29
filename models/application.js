import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  attachment: { type: mongoose.Schema.Types.ObjectId, ref: 'Attachment', required: true },
  status: { type: String, required: true, default: 'Pending' },
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
