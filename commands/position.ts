import { ICommand } from "../core/CommandManager";
import { Bot } from "mineflayer";
import { Logger } from "../core/LogManager";

const positionCommand: ICommand = {
    name: "position",
    description: 'mostra a posição atual do bot',
    execute(args: string[], bot: Bot) {
        if(!bot.entity || !bot.entity.position) {
            Logger.log('error', "PositionCommand", "Não foi possível obter a posição do bot")
            return
        }

        const { x, y, z } = bot.entity.position
        const positionMessage = `Minha posição atual: X=${x.toFixed(2)}, Y=${y.toFixed(2)}, Z=${z.toFixed(2)}`

        bot.chat(positionMessage)
        Logger.log('info', "PositionCommand", positionMessage)
    }
}

export default positionCommand