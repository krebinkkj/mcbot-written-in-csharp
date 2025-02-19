import { Bot } from "mineflayer";

export default (bot: Bot) => {
  bot.on("chat", (username, message) => {
    const args = message.split(" ");

    if (args[0] === "!setdistance") {
      const distance = parseFloat(args[1]);
      if (!isNaN(distance)) {
        (bot as any).pathfinderManager.setConfig({ followDistance: distance });
        bot.chat(
          `Distância ao seguir um jogador foi alterada para ${distance} blocos`,
        );
      } else {
        bot.chat("Erro: insira um número válido para a distãncia");
      }
    }

    if (args[0] === "!setspeed") {
      const speed = parseFloat(args[1]);
      if (!isNaN(speed)) {
        (bot as any).pathfinderManager.setConfig({ movementSpeed: speed });
        bot.chat(`Velocidade de movimento alterada para ${speed}`);
      } else {
        bot.chat("Erro: insira um número válido para a velocidade");
      }
    }
  });
};
