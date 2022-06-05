import {MessageEmbed} from 'discord.js'
import moment from 'moment'
module.exports.run = async (Redshift, message) => {
    const guild = message.guild
    const owner = await message.guild.fetchOwner();
    const serverIcon = message.guild.iconURL();
    const embed1 = new MessageEmbed()
        .setColor('#8257E5')
        .setTimestamp()
        .setAuthor({name:`Informações do Servidor`, iconURL: serverIcon})
        .addFields(
            {name: 'Nome:', value: `${guild.name}`, inline: false},
            {name: 'Id:', value: `${guild.id}`, inline: false},
            {name: 'Membros:', value: `${guild.memberCount}`, inline: false},
            {name: 'Dono:', value: `${owner.user.username}#${owner.user.discriminator}`, inline: false},
            {name: 'Id do Dono:', value: `${owner.user.id}`, inline: false},
            {name: 'Boosts:', value: `${guild.premiumSubscriptionCount} `|| 0, inline: false},
            {name: 'Criado em:', value: `${moment(guild.createdTimestamp).format("D/M/YYYY, h:mm")}`, inline: false}
            
        )
        .setFooter({text: `Executado por ${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL()})
    return message.channel.send({ embeds: [embed1] });
}

module.exports.help = {
    name: "serverinfo",
    usage: "serverinfo command "
}