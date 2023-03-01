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
  const email = req.body.email;

  if (!email) {
    res.status(400).json({  text: 'Missing email.'  });
    return;
  }

  const primerDoc = doc(db, 'users', email, 'primer', email);
  const primerSnapshot = await getDoc(primerDoc);
  const primerData = primerSnapshot.data();

  res.status(200).json({
    text: primerData?.text!,
  });
}
