import { collection, doc, getDoc, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import openai from "./chatgpt";

const query2 = async (prompt: string, chatId: string, primer: string) => {
  const { data: session } = useSession();
  const [messages, loading, error] = await useCollection(
    session &&
      query(
        collection(
          db,
          "users",
          session?.user?.email!,
          "chats",
          chatId,
          "messages"
        ),
        orderBy("createdAt", "asc")
      )
  );
  const primerRef = await doc(
    db,
    "users",
    session?.user?.email!,
    "primer",
    session?.user?.email!
  );
  const primerDoc = await getDoc(primerRef);
  function generatePrompt() {
    const primer = primerDoc.data()?.text || "DEFAULT_PRIMER_TEXT";
    const messageText = messages?.docs.map((doc) => doc.data().text).join("\n");
    return `${primer} write the words before this and ${messageText} now write the words before this ${prompt} and write this too`;
  }

  const res = await openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(),
      temperature: 0.7,
      max_tokens: 2000,
    })
    .then((res) => res.data.choices[0].text)
    .catch(
      (err) =>
        `Hmm, I may have to get out an encyclopedia! (Error: ${err.message})`
    );

  return res;
};

export default query2;
