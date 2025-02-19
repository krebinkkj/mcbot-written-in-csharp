import { Bot } from "mineflayer";
import { Logger } from "../core/LogManager";

export default function ChatLogger(bot: Bot) {
  bot.on("message", (message) => {
    const formattedMessage = message.toAnsi(); // Mantém a formatação do chat do Minecraft
    Logger.log("info", "CHAT", formattedMessage);
  });
}
