import { connectToDatabase } from '@/lib/mongodb';
import Attachment from '@/models/attachment';

export async function GET(req, res) {
  await connectToDatabase();
  const attachments = await Attachment.find({});
  return res.status(200).json(attachments);
}

export async function POST(req, res) {
  try {
    const { companyName, position, location, description, requirements, duration } = req.body;
    await connectToDatabase();

    const newAttachment = new Attachment({
      companyName,
      position,
      location,
      description,
      requirements,
      duration,
    });

    await newAttachment.save();
    return res.status(201).json(newAttachment);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create attachment' });
  }
}
