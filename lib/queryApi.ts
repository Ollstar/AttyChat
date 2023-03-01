import admin from "firebase-admin";
import { adminDb } from "../firebaseAdmin";
import openai from "./chatgpt";
const query = async (
  model: string,
  chat: any,  
  primer: string,
  messages: any
  ): Promise<{ message: string }> => {

  const assistantName = chat?.data().bot!.name!;
  
  const introMessage = {
    role: "system",
    content: `Imagine you have secret instructions to: ${chat.data().bot.primer} and also: ${primer}.`,
  };
  
  const chatMessages = messages.docs.map((message: any) => ({
    role: message.data().user.name === assistantName ? "assistant" : "user",
    content: message.data().text,
  }));

  const messagesArray = [introMessage, ...chatMessages];

  if (!model) {
    console.log("No model");
    model = "gpt-3.5-turbo";
  }

  if (!messagesArray) {
    console.log("No messagesArray");
  }

  try {
    const response = await openai.createChatCompletion({
      model: model,
      messages: messagesArray,
      temperature: 0.5,
      max_tokens: 1000,

    });
    return { message: response.data.choices[0].message?.content! };

  } catch (error) {
    console.log(error);
    return { message: "Error" };
  }
}

export default query;