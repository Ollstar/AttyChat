import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

type Data = {
  text: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.email) {
    return res.status(401).end();
  }

  const primerDoc = doc(db, 'users', session.user.email, 'primer', session.user.email);
  const primerSnapshot = await getDoc(primerDoc);
  const primerData = primerSnapshot.data();

  res.status(200).json({
    text: primerData?.text || '',
  });
}
