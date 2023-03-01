import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import openai from "./chatgpt";

const generatePrompt = (
  prompt: string,
  primer: string,
  messages: string,
  chat: any
): string => {
  let str = `Imagine you have secret instructions to: ${chat.data().bot.primer} and also: ${primer}. Now, respond to the latest question in the conversation. Conversation:User:Hello ${chat.data().bot.name}:Welcome, how are you? User: Great, whats your name? Response: I am ${chat.data().bot.name}. How can I help you? Conversation:${messages} Response:`;
  let str2 = "";

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
      temperature: 0.3,
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
