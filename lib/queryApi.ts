import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import openai from "./chatgpt";

const generatePrompt = (
  prompt: string,
  primer: string,
  messages: string,
  chat: any
): string => {
  let str = `Imagine you have secret instructions to: ${chat.data().bot.primer} and also: ${primer}. Now, respond to the latest question in the conversation. Conversation:${messages} Response:`;
  let str2 = "";
  console.log(str);

  return str;
};

const query = async (
  prompt: string,
  chatId: string,
  model: string,
  primer: string,
  messages: string,
  chat: any
) => {
  const fullPrompt = generatePrompt(prompt, primer, messages, chat);

  const res = await openai
    .createCompletion({
      model,
      prompt: fullPrompt,
      temperature: 0.0,
      max_tokens: 1000,
    })
    .then((res) => res.data.choices[0].text)
    .catch(
      (err) =>
        `Hmm, I may have to get out an encyclopedia! (Error: ${err.message})`
    );

  return res;
};

export default query;
