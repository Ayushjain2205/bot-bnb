const axios = require("axios");
require("dotenv").config();

const setWebhook = async () => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const NODE_ENV = process.env.NODE_ENV || "development";
  const DEV_URL = process.env.DEV_URL;
  const PRODUCTION_URL = process.env.PRODUCTION_URL;

  if (!TELEGRAM_BOT_TOKEN) {
    console.error(
      "Error: TELEGRAM_BOT_TOKEN is not defined in the environment variables."
    );
    process.exit(1);
  }

  const WEBHOOK_URL =
    NODE_ENV === "development"
      ? `${DEV_URL}/api/bot`
      : `${PRODUCTION_URL}/api/bot`;

  if (!WEBHOOK_URL) {
    console.error(
      `Error: ${
        NODE_ENV === "development" ? "DEV_URL" : "PRODUCTION_URL"
      } is not defined in the environment variables.`
    );
    process.exit(1);
  }

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
      {
        url: WEBHOOK_URL,
      }
    );

    if (response.data.ok) {
      console.log(
        `Webhook set successfully in ${NODE_ENV} mode: ${WEBHOOK_URL}`
      );
    } else {
      console.error("Failed to set webhook:", response.data);
    }
  } catch (error) {
    console.error("Error setting webhook:", error.message);
  }
};

setWebhook();
