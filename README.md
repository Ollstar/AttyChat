# AttyChat

AttyChat is a web application designed to research and explore the capabilities of GPT-based AI chatbots. The app allows users to create, customize, and interact with chatbots in real-time. Users can also share their chatbots, enabling others to try them out and offer feedback.

## Features

- User authentication and secure session management using NextAuth.js
- Real-time chatbot interaction and management through Firebase Firestore
- Customizable chatbot creation using GPT-based AI models
- Responsive and intuitive user interface built with React, Material-UI and TailwindCSS, and written in TypeScript
- Chatbot sharing for community engagement and feedback

<img width="661" alt="bot-interface" src="https://user-images.githubusercontent.com/10384072/235965839-5da7a927-ab4b-41a8-b5fa-c7f43a4ce491.png">

*Bot Interface*

<img width="660" alt="primer-creation" src="https://user-images.githubusercontent.com/10384072/235966289-ab806add-9a60-46e8-a725-081e5db305ac.png">

*Primer Creation Interface*

<img width="659" alt="chat-interface" src="https://user-images.githubusercontent.com/10384072/235966743-080d7f1b-fdc6-410b-afee-0403fe243ca0.png">

*Chat Interface*

## Research Conclusions

Injecting context into user prompts for GPT-based chatbots has proven to be beneficial. In user testing, we were consistently able to obtain responses that met user expectations. For instance, a restaurant bot named Starburger was created, which had a primer that included URL links for certain questions. The bot would provide current URL links in response to even vague instructions about a topic. This bot was built before the introduction of GPT plugins and was one of the few methods available to customize chatbot memory with context.

Since the introduction of plugins, newer chatbots have emerged that utilize vector databases for memory context. Vector databases are an excellent solution for memory context in chatbots due to their fast search capabilities. A user prompt can be received, the database can be queried for context, and a response can be generated in real-time conversation. It is evident that injecting context into prompts is crucial for the future of AI chatbots. AttyChat represents the first step towards context-rich chatbots.

## Skills Learned

- **Implemented** a responsive user interface using Next.js and Material-UI, resulting in an intuitive and visually appealing application.
- **Developed** real-time data synchronization between the client-side application and Firebase Firestore, enabling seamless chatbot interaction and management.
- **Integrated** GPT-based chatbot creation and customization, allowing users to create personalized AI chatbots with specific properties.
- **Explored** the impact of injecting context into user prompts for GPT-based chatbots, leading to improved chatbot performance and user satisfaction.
- **Utilized** React hooks and custom hooks to manage state and side effects, resulting in clean and modular code.
- **Incorporated** user authentication and session management using NextAuth.js, ensuring a secure user experience.
- **Developed** effective Git workflows for version control.
