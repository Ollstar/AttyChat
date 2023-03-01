import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

type Bot = {
    creatorId: string;
    primer: string;
    botName: string;
    botQuestions: string[];
    botColor: string;
    show: boolean;
    avatar: string;
    textColor: string;
  };


type Data = {
  bot: Bot;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const botid = req.body.botid;
  if (!botid) return;

  const botDoc = doc(db, 'bots', botid);
  const botSnapshot = await getDoc(botDoc);
  const botData = botSnapshot.data();

  res.status(200).json({
    bot: botData as Bot,
  });
}
