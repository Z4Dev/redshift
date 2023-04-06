import { commands } from "../structures/handlers/commands.js";

const interactionCreateEvent = {
    name: "interactionCreate",
    execute: async (client,interaction) => {
        if(interaction) {
            const command = commands.get(interaction.commandName);
            if(command) {
                await command?.execute(client,interaction)
            }
        }
    }
}

export default interactionCreateEvent;