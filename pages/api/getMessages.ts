import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

type Data = {
  messages: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { chatId, session } = req.body;

  const messagesQuery = query(
    collection(db, 'users', session.user.email, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc')
  );
  const messagesSnapshot = await getDocs(messagesQuery);
  const messagesData = messagesSnapshot.docs.map(doc => doc.data());

  res.status(200).json({ messages: messagesData });
}
