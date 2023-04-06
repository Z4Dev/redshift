import { Client, Collection, Routes, REST } from 'discord.js';
import fs from 'fs';
import Settings from '../../configs/settings.json' assert { type: "json" };
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = new Collection();

export default async function loadCommands(client) {
    const commandList = [];
    const filterfiles = fs.readdirSync(path.join(__dirname, "../../commands")).filter(file => file.endsWith('.js'));
    
    for(const file of filterfiles) {
        const command = (await import(`../../commands/${file}`)).default;
        commands.set(command.command_data.name, command)
        commandList.push(command.command_data.toJSON())
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log('[RedShift] Loading Commands...');
        await rest.put(Routes.applicationCommands(Settings.BOT_ID), { body: commandList });
        console.log('[RedShift] Commands Loaded!');
    } catch (error) {
        console.error(`Failed to load commands: ${error}`);
    }
}

export { commands };