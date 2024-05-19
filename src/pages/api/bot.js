import { NextApiRequest, NextApiResponse } from "next";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

const handler = async (req = NextApiRequest, res = NextApiResponse) => {
  if (req.method === "POST") {
    const { message } = req.body;

    if (message && message.text) {
      const chatId = message.chat.id;
      const text = message.text;

      // Send the same message back to the user
      await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
        }),
      });
    }
    res.status(200).send("OK");
  } else {
    res.status(405).send("Method Not Allowed");
  }
};

export default handler;
