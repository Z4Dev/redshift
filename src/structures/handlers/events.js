import { Client, Collection } from 'discord.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const events = new Collection();

export default async function loadEvents(client) {

    const eventfiles = fs.readdirSync(path.join(__dirname, "../../events")).filter(file => file.endsWith('.ts') || file.endsWith('js'));
    
    for(const file of eventfiles) {
        const getevent = await import(`../../events/${file}`);
        const eventcontent = getevent.default;
        events.set(eventcontent.name, eventcontent)
        client.on(eventcontent.name, (...args) => events.get(eventcontent.name)?.execute(client, ...args));
    }
}
