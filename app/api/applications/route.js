import { connectToDatabase } from '@/lib/mongodb';
import Application from '@/models/application';
import Attachment from '@/models/attachment';

export async function GET(req, res) {
  await connectToDatabase();
  const { email, companyName } = req.query;
  
  let applications;
  if (email) {
    applications = await Application.find({ email }).populate('attachment');
  } else if (companyName) {
    const attachments = await Attachment.find({ companyName });
    const attachmentIds = attachments.map(a => a._id);
    applications = await Application.find({ attachment: { $in: attachmentIds } }).populate('attachment');
  } else {
    applications = await Application.find({}).populate('attachment');
  }

  return res.status(200).json(applications);
}
