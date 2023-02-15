import { NextApiRequest, NextApiResponse } from 'next';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

type Data = {
  text: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = req.body.session;
  const text = req.body.text;

  const primerDoc = doc(db, 'users', session?.user?.email!, 'primer',session?.user?.email!);
  await setDoc(primerDoc, { text });

  res.status(200).json({
    text,
  });
}
