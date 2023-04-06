import {Client} from 'discord.js';
import 'dotenv/config';

import Intents from './structures/intents/intents.js';
import loadCommands from './structures/handlers/commands.js';
import loadEvents from './structures/handlers/events.js';

const client = new Client({
    intents: [
        Intents
    ]
})

loadCommands(client)
loadEvents(client)

client.login(process.env.TOKEN)