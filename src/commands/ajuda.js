import {MessageEmbed} from 'discord.js'
module.exports.run = async (RedShift, message, args) => {
    const embed = new MessageEmbed()
    .setColor('#8257E5')
    .setTimestamp()
    .setTitle('🚀 Rocket - Comandos RedShift')
    .setFooter({text: `Executado por ${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL()})
    RedShift.command.forEach(command => {
        if(command.help.type != "admin") {
            embed.addField(`r.${command.help.name}`, `${command.help.usage}`, false);
        }
    })
    return message.reply({embeds: [embed]})
}
module.exports.help = {
    name: "ajuda",
    usage: "Mostra a lista de comandos do RedShift",
    type: "normal"
}