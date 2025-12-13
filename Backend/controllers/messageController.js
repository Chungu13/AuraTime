import Message from "../models/messageModel.js";

// Get all messages in a room (e.g. chat history)
export const getMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ roomId }).sort("createdAt");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
