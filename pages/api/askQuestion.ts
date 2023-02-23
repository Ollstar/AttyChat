// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import query from "../../lib/queryApi";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

type Data = {
  answer: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, model, session, primer, messages } = req.body;

  if (!primer) {
    res.status(400).json({
      answer: "Please provide a primer.",
    });
    return;
  }
  if (!prompt) {
    res.status(400).json({
      answer: "Please provide a prompt.",
    });
    return;
  }

  if (!chatId) {
    res.status(400).json({
      answer: "Please provide a chat ID.",
    });
    return;
  }
  if (!messages) {
    res.status(400).json({
      answer: "Please provide a messages.",
    });
    return;
  }
  if (!session) {
    res.status(400).json({
      answer: "Please provide a session.",
    });
    return;
  }
  if (!model) {
    res.status(400).json({
      answer: "Please provide a model.",
    });
    return;
  }
  
  const chat = await adminDb
    .collection("users")
    .doc(session?.user?.email)
    .collection("chats")
    .doc(chatId)
    .get();

  // ChatGpt Query
  const response = await query(prompt, chatId, model, primer, messages, chat);

  const message: Message2 = { 
    text: response || "Hmm, I may have to get out an encyclopedia!",
    createdAt: admin.firestore.Timestamp.now(),
    userPrimer: primer,
    user: {
      _id: chat?.data()?.bot ? chat!.data()!.bot._id : "Atty Chat",
      name: chat?.data()?.bot ? chat!.data()!.bot.name : "Atty Chat",
      avatar: "https://links.papareact.com/89k",
    },
  };

  await adminDb
    .collection("users")
    .doc(session?.user?.email)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add(message);

  res.status(200).json({ answer: message.text });
}