import settings from "../configs/settings.json"
import {MessageEmbed} from 'discord.js'

module.exports.run = (Redshift, message, args) => {
    if (!message.member.roles.cache.some(role => role.id === settings.STAFF_ROLE)) return message.reply("Você não tem permissão para usar esse comando.");
    let user = message.mentions.members.first();
    let reason = args.slice(1).join(" ");

    if (user.roles.cache.some(role => role.id === settings.STAFF_ROLE)) return message.reply("Não tenho permissão para isto!");
    if(!user) return message.reply("Você precisa mencionar um usuário!")
    if (!reason) {
        reason = "Sem motivo!"
    }

    const embed = new MessageEmbed()
        .setTitle("🚀 Rocket - Punição Revogada!")
        .setColor("#8257E5")
        .setTimestamp() 
        .setThumbnail(message.guild.iconURL()) //OPTIONAL
        .setDescription("Uma punição acaba de ser revogada! \n Esperamos que ele aprenda dessa vez!")
        .addFields(
            { name: "Nome", value: `${user.user.tag}`, inline: true},
            { name: "Motivo", value: `${reason}`, inline: true },
            { name: "Tipo", value: `Timeout` }
        )
        .setFooter({text: `Autor: ${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL({dynamic: true})});
        
    user.timeout(null).then( timeout => {
        message.reply({embeds: [embed]})
    })
}

module.exports.help = {
    name: "rtimeout",
    usage: "Faça alguem abrir a matraca!",
    type: 'admin'
}