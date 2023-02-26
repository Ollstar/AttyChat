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
/**
   * Stream OpenAI completion
   * @param{string} prompt
   * @param{any} parameters
   */
// async* streamCompletion(prompt: string,
//   parameters: any): any {
// const r = await fetch(`${openAiEndpoint}/${parameters.model}/completions`, {
//   method: "POST",
//   body: JSON.stringify({
//     "prompt": prompt,
//     "temperature": parameters.temperature,
//     "max_tokens": parameters.maxTokens,
//     "top_p": parameters.topP,
//     "frequency_penalty": parameters.frequencyPenalty,
//     "presence_penalty": parameters.presencePenalty,
//     "stop": parameters.stop,
//     "stream": true,
//   }),
//   headers: {
//     "Content-Type": "application/json",
//     "Accept": "application/json",
//     "Authorization": `Bearer ${openAiKey}`,
//   },
// });
// for await (const chunk of r.body) {
//   console.log(chunk.toString());
//   if (chunk.toString().includes("error")) throw Error(chunk.toString());
//   if (chunk.toString().includes("DONE")) return;
//   // Sometimes fail parsing JSON here :/
//   const data = JSON.parse(chunk.toString().replace("data: ", ""));
//   if (!data.choices || data.choices.length === 0) continue;
//   yield data.choices[0].text;
// }
// }
  const res = await openai
    .createCompletion({
      model,
      prompt: fullPrompt,
      temperature: 0.0,
      max_tokens: 1000,
      stream: true

    })
    .then((res) => res.data.choices[0].text)
    .catch(
      (err) =>
        `Hmm, I may have to get out an encyclopedia! (Error: ${err.message})`
    );

  return res;
};

export default query;
