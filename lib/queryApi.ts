import openai from "./chatgpt";

const generatePrompt = (prompt: string, primer: string): string => {
  return `${primer} ${prompt}`;
};

const query = async (prompt: string, chatId: string, model: string, primer: string) => {
  const fullPrompt = generatePrompt(prompt, primer);

  const res = await openai
    .createCompletion({
      model,
      prompt: fullPrompt,
      temperature: 0.5,
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
