import settings from "../configs/settings.json"
import {MessageEmbed} from 'discord.js'

module.exports.run = (Redshift, message, args) => {
    if (!message.member.roles.cache.some(role => role.id === settings.STAFF_ROLE)) return message.reply("Você não tem permissão para usar esse comando.");
    let user = message.mentions.members.first();
    let time = Number(args[1]);
    let reason = args.slice(2).join(" ");

    if (user.roles.cache.some(role => role.id === settings.STAFF_ROLE)) return message.reply("Não tenho permissão para isto!");
    if(!user) return message.reply("Você precisa mencionar um usuário!")
    if(!time) return message.reply("Você precisa colocar um tempo!")
    if (!reason) return message.reply("Você precisa colocar um motivo!")

    const embed = new MessageEmbed()
        .setTitle("🚀 Rocket - Novo Timeout!")
        .setColor("#8257E5")
        .setTimestamp()
        .setDescription("Um usuário acaba de ser punido!")
        .addFields(
            { name: "Nome", value: `${user.user.tag}`, inline: true},
            { name: "Motivo", value: `${reason}`, inline: true },
            {name: "Tempo", value: `${time} segundos`}
        )
        .setFooter({text: `Autor: ${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL({dynamic: true})});
          
    user.timeout(1000 * time, reason).then( timeout => {
        message.reply({embeds: [embed]})
    })
}

module.exports.help = {
    name: "timeout",
    usage: "Faça alguem fechar a matraca!",
    type: 'admin'
}