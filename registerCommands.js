const axios = require("axios");
require("dotenv").config();

const registerCommands = async () => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  if (!TELEGRAM_BOT_TOKEN) {
    console.error(
      "Error: TELEGRAM_BOT_TOKEN is not defined in the environment variables."
    );
    process.exit(1);
  }

  const commands = [
    {
      command: "start",
      description: "Start interacting with the bot",
    },
    {
      command: "airdrops",
      description: "Get information about airdrops",
    },
    // Add more commands here if needed
  ];

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setMyCommands`,
      {
        commands: commands,
      }
    );

    if (response.data.ok) {
      console.log("Commands registered successfully");
    } else {
      console.error("Failed to register commands:", response.data);
    }
  } catch (error) {
    console.error("Error registering commands:", error.message);
  }
};

registerCommands();
