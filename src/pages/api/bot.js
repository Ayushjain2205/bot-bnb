import { NextApiRequest, NextApiResponse } from "next";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

// Command Handlers
const commandHandlers = {
  "/start": (chatId) => ({
    chat_id: chatId,
    text: "Welcome! How can I assist you today?",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Airdrops", callback_data: "airdrops" },
          { text: "Help", callback_data: "help" },
        ],
      ],
    },
  }),
  "/airdrops": (chatId) => ({
    chat_id: chatId,
    text: "Here are the latest airdrops...",
  }),
};

// Function to send a message
const sendMessage = async (chatId, text, replyMarkup = null) => {
  const body = {
    chat_id: chatId,
    text: text,
  };

  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }

  await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

// Main handler
const handler = async (req = NextApiRequest, res = NextApiResponse) => {
  if (req.method === "POST") {
    const { message, callback_query } = req.body;

    if (callback_query) {
      const chatId = callback_query.message.chat.id;
      const data = callback_query.data;

      if (data === "airdrops") {
        await sendMessage(chatId, "Here are the latest airdrops...");
      } else if (data === "help") {
        await sendMessage(chatId, "Here is some help information...");
      }
    } else if (message && message.text) {
      const chatId = message.chat.id;
      const text = message.text;

      // Check if the message is a command
      if (text.startsWith("/")) {
        const command = text.split(" ")[0];
        const commandHandler = commandHandlers[command];

        if (commandHandler) {
          const response = commandHandler(chatId);
          await sendMessage(
            response.chat_id,
            response.text,
            response.reply_markup
          );
        } else {
          await sendMessage(chatId, "Unknown command. Please try again.");
        }
      } else {
        // Echo the message back if it's not a command
        await sendMessage(chatId, text);
      }
    }
    res.status(200).send("OK");
  } else {
    res.status(405).send("Method Not Allowed");
  }
};

export default handler;
