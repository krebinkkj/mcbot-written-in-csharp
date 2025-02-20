import { throws } from "assert";
import { Logger } from "../core/LogManager";
import { Bot } from "mineflayer";
import { pathfinder, Movements, goals } from "mineflayer-pathfinder";

export class PathfinderManager {
  private bot: Bot;
  private movements: Movements;
  private strategies: Map<string, (params?: any) => void> = new Map();
  private config: { followDistance: number; movementSpeed: number };

  constructor(bot: Bot) {
    this.bot = bot;
    this.config = {
      followDistance: 2,
      movementSpeed: 0.4,
    };

    if (!(this.bot as any)._pathfinderLoaded) {
      this.bot.loadPlugin(pathfinder);
      (this.bot as any)._pathfinderLoaded = true;
    }

    this.movements = new Movements(bot);
    this.movements.canDig = true;

    this.bot.pathfinder?.setMovements(this.movements);
    this.registerStrategy("goto", this.goTo.bind(this));
    this.registerStrategy("follow", this.followPlayer.bind(this));
    this.registerStrategy("stop", this.stop.bind(this));
  }
  /** Define novas configurações para o pathfinder */
  public setConfig(
    newConfig: Partial<{ followDistance: number; movementSpeed: number }>,
  ) {
    this.config = { ...this.config, ...newConfig };
    Logger.log(
      "info",
      "[Pathfinder]",
      " Configuração atualizada:",
      this.config,
    );
  }

  /** Move o bot para coordenadas específicas */
  public goTo({ x, y, z }: { x: number; y: number; z: number }) {
    if (!this.bot.pathfinder) return console.log("Pathfinder não carregado");
    this.bot.chat(`Indo para X=${x}, Y=${y}, Z=${z}`);
    this.bot.pathfinder.setGoal(new goals.GoalBlock(x, y, z));
  }

  /** Seguir jogador */
  public followPlayer({ username }: { username: string }) {
    const player = this.bot.players[username]?.entity;
    if (!player) {
      this.bot.chat(`Não consigo ver ${username}!`);
      return;
    }
    this.bot.chat(
      `Seguindo ${username} a uma distãncia de ${this.config.followDistance} blocos`,
    );
    this.bot.pathfinder.setGoal(
      new goals.GoalFollow(player, this.config.followDistance),
    );
  }

  /** Para qualquer movimento autal */
  public stop() {
    if (!this.bot.pathfinder)
      return Logger.log("info", "pathfinder", "Plugin não foi carregado");
    this.bot.chat("Parando...");
    this.bot.pathfinder.setGoal(null);
  }
  /** Registra uma nova estratégia de movimentação */
  public registerStrategy(name: string, strategy: (params?: any) => void) {
    this.strategies.set(name, strategy);
  }

  /** Executa uma estratégia específica */
  public executeStrategy(name: string, params?: any) {
    const strategy = this.strategies.get(name);
    if (strategy) {
      strategy(params);
    } else {
      Logger.log(
        "error",
        "[Pathfinder]",
        'Estratégia de movimento "${name}" não encontrada.',
      );
    }
  }

  public isPathfinderLoaded(): boolean {
    return !!this.bot.pathfinder
  }
}

// Exportando como um plugin
export default (bot: Bot) => {
  if (!(bot as any).pathfinderManager) {
    (bot as any).pathfinderManager = new PathfinderManager(bot);
  }
};
