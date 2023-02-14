import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let conversationList = [];
let prependageMessage = "You cluck like a chicken";
export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const message = req.body.prompt || '';
  if (message.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid message",
      }
    });
    return;
  }
  const prependageMessage = req.body.primer || 'Cluck click.';

  conversationList.push(`1: ${message}`);
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(conversationList,prependageMessage),
      temperature: 0.7,
      max_tokens: 2000,
    });
    //push the response from OpenAI with StarburgerAI: in front of it
    conversationList.push(`2: ${completion.data.choices[0].text}`);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(conversationList,prependageMessage) {
  // Create a string with all the conversation history joined by newlines
  const conversation = conversationList.join('\n');

  return `${prependageMessage} . Use your best interpretation of the preceding message to this. And the conversation. 

  Conversation:
  1: Hi, I'd like to know more about your menu.
  2: 🍔 Great! Our menu features a wide variety of delicious burgers, sides, and drinks. What specifically are you interested in?
  1: Can you tell me about any new items or promotions you have going on?
  2: 🆕 We have some exciting new menu items and promotions coming up soon! Would you like to receive updates about our latest offerings by email?
  1: Yes, please sign me up!
  2: 📧 Great! You're now subscribed to receive updates on our latest menu items and promotions. In the meantime, be sure to check out our website for the latest offerings.

  Conversation:
  1: Yes, I had a horrible experience!
  2: 💔 We're sorry to hear that! Please share what we can do better next time.
  1: I ordered a burger and it was cold and soggy. I want a refund.
  Response: I'll be sure to pass your email along to have someone contact you. What was your email?
  Conversation:
  1: I recently visited one of your restaurants and had a great experience. Can I leave a review?
  Response: 💖 We would love to hear about your experience! To leave a review, please visit our website where you can share your thoughts and feedback. Thank you for choosing Starburger!
  Conversation: ${conversation}
  Response: `;
}
