import { Bot } from "mineflayer";
import * as fs from "fs";
import * as path from "path";
import * as configData from "../config.json";
import { Logger } from "./LogManager";
import chalk from "chalk";

export class PluginManager {
  private bot: Bot;
  private config: any;

  constructor(bot: Bot) {
    this.bot = bot;
    this.config = configData.plugins || {};

    this.bot.once("spawn", () => {
      this.loadPlugins();
    });
  }

  public async loadPlugins() {
    const pluginsDir = path.join(__dirname, "../plugins");
    if (!fs.existsSync(pluginsDir)) {
      fs.mkdirSync(pluginsDir, { recursive: true });
    }

    const pluginFiles = fs
      .readdirSync(pluginsDir)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of pluginFiles) {
      const pluginName = file.replace(/\.(ts|js)$/, "");

      if (this.config[pluginName]?.enabled === false) {
        Logger.log(
          "info",
          "PluginManager",
          `Plugin ${pluginName} está desativado.`,
        );
        continue;
      }

      const pluginPath = path.join(pluginsDir, file);
      try {
        const pluginModule = await import(pluginPath);

        if (pluginModule.default) {
          pluginModule.default(this.bot);
          Logger.log(
            "info",
            "PluginManager",
            `O plugin ${pluginName} foi carregado!`,
          );
        } else {
          Logger.log(
            "info",
            "PluginManager",
            `${pluginName} não exporta um plugin válido `,
          );
        }
      } catch (error) {
        Logger.log(
          "error",
          "PluginManager",
          `Erro no ${pluginName}:\n ${error}`,
        );
      }
    }
  }
}
