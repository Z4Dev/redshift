import { MessageEmbed } from "discord.js"
import moment from 'moment'
module.exports.run = async (Redshift, message) => {
    const user = message.mentions.members.first() || message.author

    if (!user.user) {
        const embed1 = new MessageEmbed()
        .setColor('#8257E5')
        .setTimestamp()
        .setAuthor({name:`Informações de ${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .addFields(
            {name: 'Nome:', value: `${message.author.username}`, inline: true},
            {name: 'Tag:', value: `${message.author.discriminator}`, inline: true},
            {name: 'Id:', value: `${message.author.id}`, inline: false},
            {name: 'Criado em:', value: `${message.author.createdAt.toLocaleString()}`, inline: false},
            {name: 'Entrou em:', value: `${moment(message.member.joinedTimestamp).format("D/M/YYYY, h:mm")}`, inline: false}
        )
        .setFooter({text: `Executado por ${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL()})
        return message.channel.send({ embeds: [embed1] });
    }   

  const embed1 = new MessageEmbed()
	.setColor('#8257E5')
    .setTimestamp()
	.setAuthor({name:`Informações de ${user.user.username}`, iconURL: user.displayAvatarURL()})
    .addFields(
        {name: 'Nome:', value: `${user.user.username}`, inline: true},
        {name: 'Tag:', value: `${user.user.discriminator}`, inline: true},
        {name: 'Id:', value: `${user.user.id}`, inline: false},
        {name: 'Criado em:', value: `${user.user.createdAt.toLocaleString()}`, inline: false},
        {name: 'Entrou em:', value: `${moment(user.joinedTimestamp).format("D/M/YYYY, h:mm")}`, inline: false}
    )
    .setFooter({text: `Executado por ${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL()})
    message.channel.send({ embeds: [ embed1 ] });
};

module.exports.help = {
    name: "userinfo",
    usage: "Mostra algumas informações de algum usuário",
    type: "normal"
}
