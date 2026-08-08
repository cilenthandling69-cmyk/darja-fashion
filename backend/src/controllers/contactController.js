import ContactMessage from "../models/ContactMessage.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone = "", subject, message } = req.body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    res.status(400);
    throw new Error("Name, email, subject, and message are required");
  }

  const contactMessage = await ContactMessage.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    subject: subject.trim(),
    message: message.trim(),
  });

  res.status(201).json({
    success: true,
    message: "Your message has been received. Darja Fashion will contact you soon.",
    contactId: contactMessage._id,
  });
});

export const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(250);
  res.json({ success: true, messages });
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const allowedStatuses = ["new", "read", "replied"];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid contact-message status");
  }

  const contactMessage = await ContactMessage.findById(req.params.id);
  if (!contactMessage) {
    res.status(404);
    throw new Error("Contact message not found");
  }

  contactMessage.status = status;
  await contactMessage.save();

  res.json({ success: true, message: contactMessage });
});

export const replyToContactMessage = asyncHandler(async (req, res) => {
  const reply = req.body.reply?.trim();
  if (!reply) {
    res.status(400);
    throw new Error("Reply message is required");
  }

  const contactMessage = await ContactMessage.findById(req.params.id);
  if (!contactMessage) {
    res.status(404);
    throw new Error("Contact message not found");
  }

  contactMessage.reply = reply;
  contactMessage.repliedAt = new Date();
  contactMessage.status = "replied";
  await contactMessage.save();

  res.json({ success: true, message: contactMessage });
});
