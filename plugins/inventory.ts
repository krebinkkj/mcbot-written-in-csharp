import { Bot } from "mineflayer";
import { Logger } from "../core/LogManager";

export class InventoryManager {
  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  /* Lista todos os itens do inventário */
  public listInventory(): string {
    const items = this.bot.inventory.items();
    if (items.length === 0) return "O inventário está vazio";
    return items.map((item) => `${item.name} (x${item.count})`).join(", ");
  }

  /* Organiza o inventário agrupando itens semelhantes */
  public organizeInventory() {
    this.bot.chat("Organizando meu inventário...");

    this.bot.inventory.items().forEach((item) => {
      this.bot
        .tossStack(item)
        .catch((err) => this.bot.chat(`Erro ao organizar: ${err}`));
    });
  }

  /* Equipa automaticamento o melhor item disoinível */
  public async autoEquip(category: "hand" | "armor" | "off-hand") {
    const items = this.bot.inventory.items();
    if (items.length === 0) {
      Logger.log(
        "error",
        "InventoryManager",
        "Nenhum item disponível para equipar",
      );
      return;
    }

    // Exemplo simple: equipa a primeira ferramenta ou arma encontrada
    const item = items.find(
      (item) => item.name.includes("sword") || item.name.includes("pickaxe"),
    );
    if (!item) {
      Logger.log(
        "error",
        "InventoryManager",
        "Nenhuma arma ou ferramenta encontrada",
      );
      return;
    }

    try {
      // @ts-expect-error Será ser corrigido futuramente
      await this.bot.equip(item, category);
      Logger.log("sucess", `InventoryManager`, `Equipado: ${item.name}`);
      this.bot.chat(`Equipado: ${item.name}`);
    } catch (err) {
      Logger.log(
        "error",
        "InventoryManager",
        `Erro ao equipar ${item.name}: ${err}`,
      );
      this.bot.chat(`Erro ao equipar ${item.name}`);
    }
  }

  /* Deposita um item especifico em um baú */
  public async storeItem(itemName: string, chest: any) {
    const item = this.bot.inventory.items().find((i) => i.name === itemName);
    if (!item) {
      Logger.log(
        "error",
        "InventoryManager",
        `Item ${itemName} não encontrado`,
      );
      this.bot.chat(`Item ${itemName} não encontrado`);
      return;
    }

    try {
      await chest.deposit(item.type, null, item.count);
      Logger.log(
        "sucess",
        "InventoryManager",
        `Guardado ${item.count}x ${item.name} no baú`,
      );
      this.bot.chat(`Guardado ${item.count}x ${item.name} no baú`);
    } catch (err) {
      Logger.log(
        "error",
        "inventoryManager",
        `Erro ao guardar item no baú: ${err}`,
      );
      this.bot.chat(`Error ao guardar item no baú`);
    }
  }

  /* Retira um item do baú (por enquanto só suporta uma única quantia (1))*/
  public async retrieveItem(itemName: string, chest: any) {
    try {
      await chest.withdraw(itemName, null, 1);
      Logger.log(
        "sucess",
        "InventoryManager",
        `Retirando 1x ${itemName} do baú`,
      );
    } catch (err) {
      Logger.log(
        "error",
        "InventoryManager",
        `Erro ao retirar item do baú: ${err} `,
      );
    }
  }
}


export default (bot: Bot) => {
    if(!(bot as any).inventoryManager) {
        (bot as any).inventoryManager = new InventoryManager(bot)
    }
}