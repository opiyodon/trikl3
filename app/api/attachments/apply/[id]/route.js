import { connectToDatabase } from '@/lib/mongodb';
import Application from '@/models/application';
import Attachment from '@/models/attachment';

export async function POST(req, res) {
  try {
    const { studentName, email, message } = req.body;
    const { id } = req.query;
    await connectToDatabase();

    const attachment = await Attachment.findById(id);
    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    const newApplication = new Application({
      studentName,
      email,
      message,
      attachment: id,
      status: 'Pending',
    });

    await newApplication.save();
    return res.status(201).json(newApplication);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to submit application' });
  }
}
