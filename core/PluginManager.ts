import { Bot } from "mineflayer";
import * as fs from "fs";
import * as path from "path";
import { Logger } from "./LogManager";
import configData from "../config.json";
import chalk from "chalk";

export class PluginManager {
  private bot: Bot;
  private config: any;
  private loadedPlugins: Set<string>;

  constructor(bot: Bot) {
    this.bot = bot;
    this.config = configData.plugins || {};
    this.loadedPlugins = new Set();
  }

  public loadPlugins() {
    const pluginsDir = path.join(__dirname, "../plugins");

    // Verifica se o diretório de plugins existe
    if (!fs.existsSync(pluginsDir)) {
      fs.mkdirSync(pluginsDir, { recursive: true });
    }

    // Lê todos os arquivos de plugins na pasta plugins
    const pluginFiles = fs
      .readdirSync(pluginsDir)
      .filter((file) => file.endsWith(".ts"));

    pluginFiles.forEach((file) => {
      const pluginName = file.replace(".ts", ""); // Remover a extensão .ts

      // Verifica se o plugin já foi carregado
      if (this.isPluginLoaded(pluginName)) {
        Logger.log(
          `info`,
          "PluginManager",
          `Plugin ${chalk.yellowBright(pluginName)} já foi carregado`,
        );
        return;
      }

      // Verfica se o plugin está desativado (caso exista no arquivo de configuração)
      if (this.config[pluginName]?.enabled === false) {
        Logger.log(
          "info",
          "PluginManager",
          `Plugin ${chalk.yellowBright(pluginName)} está desativado`,
        );
        return;
      }

      const pluginPath = path.join(pluginsDir, file);

      try {
        // Carrega o plugin
        const plugin = require(pluginPath);

        plugin.default(this.bot);

        // Marca o plugin como carregado
        this.loadedPlugins.add(pluginName);
        Logger.log(
          "info",
          "PluginManager",
          `Plugin ${chalk.yellowBright(pluginName)} foi carregado`,
        );
      } catch (error) {
        Logger.log(
          `error`,
          "PluginManager",
          `Erro ao carregado o plugin ${chalk.yellowBright(pluginName)}: ${error}`,
        );
      }
    });
  }

  // Função para verificar se o plugin já foi carregado
  public isPluginLoaded(pluginName: string): boolean {
    return this.loadedPlugins.has(pluginName);
  }
}
