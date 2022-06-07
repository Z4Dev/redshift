import {MessageEmbed} from 'discord.js';
import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
module.exports.run = (Redshift, message) => {
    var db = new JsonDB(new Config("ADVS", true, false, '/'));
    db.reload()
    const user = message.mentions.members.first();
    if(!user) {
        try {
            var data = db.getData(`/${message.author.id}`)
        } catch(err) {
            db.push(`/${message.author.id}`, 0)
        }
        var data = db.getData(`/${message.author.id}`)
        const embed = new MessageEmbed()
        .setColor('#8257E5')
        .setTimestamp()
        .setTitle('🚀 Rocket - Advertências')
        .setDescription(`Atualmente você tem **${data}** advertências !`)
        .setFooter({text: `Executado por ${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
        return message.reply({embeds: [embed]})
    }
    try {
        var data = db.getData(`/${user.id}`)
    } catch(err) {
        db.push(`/${user.id}`, 0)
    }
    var data = db.getData(`/${user.id}`)
    const embed = new MessageEmbed()
    .setColor('#8257E5')
    .setTimestamp()
    .setTitle('🚀 Rocket - Advertências')
    .setDescription(`Atualmente ${user} tem **${data}** advertências !`)
    .setFooter({text: `Executado por ${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
    return message.reply({embeds: [embed]})


}
module.exports.help = {
    name: "advs",
    usage: "Mostra as advertências de algum usuário",
    type: 'normal'
}