// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import query2 from "../../lib/queryApi";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";
import { useSession } from "next-auth/react";

type Data = {
  answer: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body)
  const prompt = req.body.prompt || '';
  if (prompt.trim().length === 0) {
    res.status(200).json({ answer: "Please ask a question!" });
    return;
  }
  const prependageMessage = req.body.primer || 'Cluck click.';
const session = req.body.session;
const chatId = req.body.chatId;
  // ChatGpt Query
  const response = await query2(prompt, req.body.chatId, prependageMessage);

  const message: Message = {
    text: response || "Hmm, I may have to get out an encyclopedia!",
    createdAt: admin.firestore.Timestamp.now(),
    user: {
      _id: "ChatGPT",
      name: "ChatGPT",
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