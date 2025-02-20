import { ICommand } from '../core/CommandManager'
import { Bot } from 'mineflayer'
import { Logger } from '../core/LogManager'

const moveCommand: ICommand = {
    name: 'move',
    description: 'Move o bot para uma posição específica (x, y, z)',
    execute(args: string[], bot: Bot) {
        if (args.length !== 3) {
            bot.chat("Você precisa fornecer 3 argumentos: x, y, z")
            return
        }

        const x = parseFloat(args[0])
        const y = parseFloat(args[1])
        const z = parseFloat(args[2])

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            Logger.log('error', 'MoveCommand', 'Todos os argumentos precisam ser números')
            return
        }

        const pathfinder = (bot as any).pathfinderManager
        
        if (!pathfinder || typeof pathfinder.executeStrategy !== "function") {
            Logger.log('error', 'MoveCommand', 'Pathfinder não está carregado')
            return
        } 

        pathfinder.executeStrategy("goto", { x, y, z })
    }
}

export default moveCommand