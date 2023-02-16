import openai from "./chatgpt";

const generatePrompt = (prompt: string, primer: string, messages: string[]): string => {
  const conversation = messages.join("\n");
  return `${primer} You are ChatGPT in this conversation Conversation: ${conversation} Now imagine someone asks: \n${prompt}`;
};

const query = async (
  prompt: string,
  chatId: string,
  model: string,
  primer: string,
  messages: string[]
) => {
  const fullPrompt = generatePrompt(prompt, primer, messages);

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
