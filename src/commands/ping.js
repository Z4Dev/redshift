import { SlashCommandBuilder, EmbedBuilder,PermissionFlagsBits } from "discord.js";
const Command = {
    command_data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setName('ping')
    .setDescription('[Admin] Ping Command'),

    execute: async (client, interaction) => {
        interaction.reply({ embeds: [new EmbedBuilder().setTitle('Pong!').setDescription(`A latência da API é ${Math.round(client.ws.ping)}ms`)] })
    }
}

export default Command;