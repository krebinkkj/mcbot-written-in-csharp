import { Bot } from "mineflayer";
import { goals, Movements } from "mineflayer-pathfinder";
import { Logger } from "../core/LogManager";
import { Vec3 } from "vec3";

declare module "mineflayer" {
  interface Bot {
    autoMine: (blockNames: string[]) => Promise<void>;
  }
}

export default function AutoMiner(bot: Bot) {
  const mcData = require("minecraft-data");
  const pathfinder = bot.loadPlugin(
    require("mineflayer-pathfinder").pathfinder,
  );
  const movements = new Movements(bot);

  bot.pathfinder.setMovements(movements);

  bot.autoMine = async (blockNames: string[]) => {
    for (const blockName of blockNames) {
      const block = mcData.blocksByName[blockName];
      if (!block) {
        Logger.log(
          "warn",
          "AutoMiner",
          `Bloco ${blockName} não foi encontrado`,
        );
        bot.chat(`Bloco "${blockName}" não foi encontrado`);
        continue;
      }

      const targetBlock = bot.findBlock({
        matching: block.id,
        maxDistance: 32,
      });

      if (!targetBlock) {
        Logger.log(
          "warn",
          "AutoMiner",
          `Nenhum bloco "${blockName}" encontrado por perto`,
        );
        bot.chat(`Nenhum bloco "${blockName}" encontrado por perto`);
        continue;
      }

      Logger.log("info", "AutoMiner", `Indo minerar ${blockName}...`);
      bot.chat(`Indo minerar ${blockName}...`);
      await bot.pathfinder.goto(
        new goals.GoalBlock(
          targetBlock.position.x,
          targetBlock.position.y,
          targetBlock.position.z,
        ),
      );

      try {
        await bot.dig(targetBlock);

        Logger.log(
          "sucess",
          `AutoMiner`,
          `Bloco ${blockName} foi minerado com sucesso`,
        );
        bot.chat(`Bloco ${blockName} foi minerado com sucesso`);
      } catch (err) {
        Logger.log(
          "error",
          `AutoMiner`,
          `Erro ao minerar "${blockName}".\n`,
          err,
        );
      }
    }
  };
}
