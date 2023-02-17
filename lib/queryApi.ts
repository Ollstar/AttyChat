import openai from "./chatgpt";

const generatePrompt = (prompt: string, primer: string, messages: string): string => {
  return `${primer} Conversation:${messages}\n${prompt} Response:`;
};

const query = async (
  prompt: string,
  chatId: string,
  model: string,
  primer: string,
  messages: string
) => {
  const fullPrompt = generatePrompt(prompt, primer, messages);
  console.log(fullPrompt);

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
