import * as mineflayer from "mineflayer";
import { BotManager } from "./core/BotManager";

import * as config from "./config.json";

const botManager = new BotManager(config);

botManager.start();
