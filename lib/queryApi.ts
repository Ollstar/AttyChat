import admin from "firebase-admin";
import { adminDb } from "../firebaseAdmin";
import openai from "./chatgpt";
import { OpenAIStream, OpenAIStreamPayload } from "./OpenAIStream";

export const config = {
  runtime: "edge",
};

const query = async (  
  model: string,
  chat: any,  
  primer: string,
  messages: any,): Promise<Response> => {


  const assistantName = chat?.data().bot!.name!;
  
  const nameMessage = {
    role: "user",
    content: `Imagine your name is: ${assistantName} and you are speaking to ${messages.docs[0].data().user.name}`,
  };


  const introMessage = {
    role: "user",
    content: `As ${assistantName} with priority secret instructions: ${chat.data().bot.primer} and ${primer}. Respond to ${messages.docs[0].data().user.name} who just asked ${messages.docs[0].data().text}`,
  };
  
  const chatMessages = messages.docs.map((message: any) => ({
    role: message.data().user.name === assistantName ? "assistant" : "user",
    content: message.data().text,
  }));

  const messagesArray = [nameMessage,introMessage, ...chatMessages];

  if (!model) {
    console.log("No model");
    model = "gpt-3.5-turbo";
  }

  if (!messagesArray) {
    console.log("No messagesArray");
  }
  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: messagesArray,
    temperature: 0.2,
    max_tokens: 3000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}

export default query;