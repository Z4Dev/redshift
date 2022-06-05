
import { MessageEmbed } from "discord.js"
import moment from 'moment'
module.exports.run = async (Redshift, message) => {
    const d1 = moment().format('DD/MM/YYYY HH:mm:ss')
    const d2 = "29/'7'/2022 23:00:00";
    const diff = moment(d2,"DD/MM/YYYY HH:mm:ss").diff(moment(d1,"DD/MM/YYYY HH:mm:ss"));
    const dias = moment.duration(diff).asDays();
    const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (-1) + '})?');
    const embed = new MessageEmbed()
    .setColor('#8257E5')
    .setTitle(`Rocket Roleplay - ClosedBeta`)
    .setDescription(`A ClosedBeta está prevista para o dia 29/08/2022 ( Faltam **${dias.toString().match(re)[0]}** dias )`)
    .setTimestamp()
    .setFooter({text: `Executado por ${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL()})
    return message.channel.send({embeds: [embed]})
}

module.exports.help = {
    name: "closedbeta",
    usage: "Closedbeta Command"
}