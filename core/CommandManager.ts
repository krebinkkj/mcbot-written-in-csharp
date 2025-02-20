import { Bot } from "mineflayer";
import { Logger } from "./LogManager";
import * as fs from 'fs'
import * as path from 'path'

export interface ICommand {
  name: string,
  description: string;
  execute(args: string[], bot: Bot): void
}

export class CommandManager {
  private bot: Bot
  private commands: Map<string, ICommand> = new Map(); // Mapa para armazenar comandos

  constructor(bot: Bot) {
    this.bot = bot
    this.loadCommands() // Carregar automaticamente os comandos
  }

  /* Carrega todos os comandos da pasta commands */
  private loadCommands()  {
    const commandsDir = path.join(__dirname, '../commands')

    // Verifica se a pasta de comandos existe
    if (!fs.existsSync(commandsDir)) {
      fs.mkdirSync(commandsDir, { recursive: true })
    }

    // Lê todos os arquivos TypeScript na pasta de comandos
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.ts'))
    for (const file of commandFiles) {
      try {
        const commandModule = require(path.join(commandsDir, file))
        const command: ICommand = commandModule.default || commandModule.command

        if (command && command.name) {
          this.commands.set(command.name, command)
          this.bot.on('login', () => {
            Logger.log('info', 'CommandManager', `Comando ${command.name} foi carregado`)
          })
        }
      } catch (error ){
        Logger.log('error', 'CommandManager', `Erro ao caregar o comando ${file}: ${error}`)
      }
    }
  }

  /* Executa um comando */
  private executeCommand(name: string, args: string[]) {
    const command = this.commands.get(name);
    if (command) {
      command.execute(args, this.bot)
    } else {
      Logger.log('error', 'CommandManager', `Comando "${name}" não encontado`)
    }
  }

  /* Escuta comandos do chat */
  public listenForCommands() {
    this.bot.on('chat', (username, message) => {
      if (message.startsWith('!')) {
        const [name, ...args] = message.slice(1).split(' ')
        this.executeCommand(name, args)
      }
    })
  }
}