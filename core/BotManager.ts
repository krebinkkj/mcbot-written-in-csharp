import * as mineflayer from "mineflayer";
import { CommandManager } from "./CommandManager";
import { PluginManager } from "./PluginManager";
import { Logger } from "./LogManager";

export class BotManager {
  private bot: mineflayer.Bot;
  private commandManager: CommandManager;
  private pluginManager: PluginManager;

  constructor(config: {
    host: string;
    port: number;
    username: string;
    version: any | string;
  }) {
    this.bot = mineflayer.createBot({
      host: config.host,
      port: config.port,
      username: config.username,
      auth: "offline",
      version: config.version,
    });

    this.bot.once("login", () => {
      Logger.log("info", "BotManager", `Bot Iniciado, carregando plugins...`);
    });

    this.commandManager = new CommandManager(this.bot);
    this.pluginManager = new PluginManager(this.bot);

    this.bot.on("error", (err) => {
      Logger.log("info", "BotManager", `${err}`);
    });

    this.bot.on("end", () => {
      Logger.log("info", "BotManager", "Bot desconectado");
    });
  }

  public start() {
    this.commandManager.registerCommand("ping", (_, bot) => {
      bot.chat("Pong");
    });
  }
}
