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
  const { chatId, model, session, primer } = req.body;
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

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  // This data is a ReadableStream
  const data = response.body;
  if (!data) {
    return;
  }

  const reader = data.getReader();
  const decoder = new TextDecoder();
 // Create a new message document with a unique ID
const messageRef = adminDb
.collection("users")
.doc(session?.user?.email)
.collection("chats")
.doc(chatId)
.collection("messages")
.doc();

// Create the message object with the unique ID
const message: Message2 = {
text: "",
createdAt: admin.firestore.Timestamp.now(),
userPrimer: primer,
user: {
  _id: chat?.data()?.bot ? chat!.data()!.bot._id : "Atty Chat",
  name: chat?.data()?.bot ? chat!.data()!.bot.name : "Atty Chat",
  avatar: "https://links.papareact.com/89k",
},
};

// Add the message document to the Firestore collection
await messageRef.set(message);

let done = false;
let chunkValue = '';

while (!done) {
const { value, done: doneReading } = await reader.read();
done = doneReading;
chunkValue += decoder.decode(value);

if (chunkValue.length > 0) {
  // Update the message document with the new chunk
  await messageRef.update({
    text: chunkValue,
  });

}
}

  res.status(200).json({ answer: response.statusText });
}
