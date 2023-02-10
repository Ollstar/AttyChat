import openai from "./chatgpt";

const query = async (prompt: string, chatId: string, model: string) => {
  const res = await openai
    .createCompletion({
      model,
      prompt,
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
