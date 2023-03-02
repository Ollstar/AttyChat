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
  const { prompt, chatId, model, session, primer } = req.body;
  if (!session) {
    res.status(400).json({
      answer: "Please provide a session.",
    });
    return;
  }
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


  if (!model) {
    res.status(400).json({
      answer: "Please provide a model.",
    });
    return;
  }

  const chatRef = adminDb
    .collection("users")
    .doc(session?.user?.email)
    .collection("chats")
    .doc(chatId);

  const chat = await chatRef.get();

  const chatRefMessages = adminDb
    .collection("users")
    .doc(session?.user?.email)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .orderBy("createdAt", "asc");

  const messages2 = await chatRefMessages.get();

  // ChatGpt Query
  const response = await query(model, chat, primer, messages2);


  console.log("Response: ", response);
  const message: Message2 = {
    text: response.message,
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

  res.status(200).json({ answer: "Message" });
}
