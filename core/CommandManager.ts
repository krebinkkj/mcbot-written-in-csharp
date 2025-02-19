import { Bot } from "mineflayer";

export class CommandManager {
  private bot: Bot;
  private commands: { [command: string]: (args: string[], bot: Bot) => void } =
    {};

  constructor(bot: Bot) {
    this.bot = bot;
  }

  // Método para registrar e responder comandos
  public registerCommand(
    command: string,
    callback: (args: string[], bot: Bot) => void,
  ) {
    this.commands[command] = callback;
  }

  public processCommand(message: string) {
    const [command, ...args] = message.split(" ");

    if (this.commands[command]) {
      this.commands[command](args, this.bot);
    }
  }

  public listenForCommands() {
    this.bot.on("chat", (username, message) => {
      this.processCommand(message);
    });
  }
}
