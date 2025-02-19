import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";

export class Logger {
  private static logDirectory = path.join(__dirname, "..", "logs"); // Diretório para os arquivos de log
  private static logFileName: string | null = null; // Inicializado como null, sem valor até que o arquivo de log seja criado

  static formatTimestamp(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}:${milliseconds}`;
  }

  // Função para criar um arquivo de log único
  private static createLogFile() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Timestamp para nome do arquivo
    this.logFileName = `log-${timestamp}.log`; // Definir logFileName
    const logFilePath = path.join(this.logDirectory, this.logFileName);

    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }

    // Garantir que o arquivo de log seja criado
    if (!fs.existsSync(logFilePath)) {
      fs.writeFileSync(
        logFilePath,
        `Log iniciado em: ${this.formatTimestamp()}\n\n`,
      );
    }
  }

  // Função para registrar no terminal e no arquivo
  static log(
    level: "info" | "error" | "warn" | "debug",
    source: string,
    message: string,
    param?: any,
  ) {
    // Garantir que o arquivo de log tenha sido criado antes de usar
    if (!this.logFileName) {
      this.createLogFile(); // Criar o arquivo de log na primeira execução
    }

    const timestamp = this.formatTimestamp();
    let levelColor: string;

    switch (level) {
      case "info":
        levelColor = chalk.blue.bold(level.toUpperCase());
        break;
      case "error":
        levelColor = chalk.red.bold(level.toUpperCase());
        break;
      case "warn":
        levelColor = chalk.yellow.bold(level.toUpperCase());
        break;
      case "debug":
        levelColor = chalk.magenta.bold(level.toUpperCase());
        break;
      default:
        levelColor = chalk.white.bold(level);
        break;
    }

    // Formatar log
    const logMessage =
      `${chalk.gray.bold("[")}${chalk.cyan(timestamp)}${chalk.gray.bold("]")} ` +
      `${chalk.gray.bold("[")}${levelColor}${chalk.gray.bold("]")} ` +
      `${chalk.gray.bold("[")}${chalk.green(source)}${chalk.gray.bold("]")}: ` +
      `${message}`;

    // Exibir no terminal
    console.log(logMessage);

    const SimpleLogs = `[${timestamp}] [${level}] [${source}]: ${message}`;
    // Garantir que logFileName seja válido antes de gravar no arquivo
    if (this.logFileName) {
      const logFilePath = path.join(this.logDirectory, this.logFileName);
      fs.appendFileSync(logFilePath, `${SimpleLogs}\n`);
    }
  }
}
