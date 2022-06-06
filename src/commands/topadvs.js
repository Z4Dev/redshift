import {MessageEmbed} from 'discord.js'
import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

module.exports.run = async (Redshift, message) => {
    var db = new JsonDB(new Config("ADVS", true, false, '/'));
    db.reload()
    const values = []
    for(const linhas in db.data) {
        await message.guild.members.fetch(linhas).then(infos => {
            if(infos != undefined) {
                const data = db.getData(`/${linhas}`)
                values.push({
                    id: linhas,
                    value: data
                })
            }
        })
    }
    values.sort(function(z, x) {
        if(z.value < x.value) {
          return -1;
        } else {
          return true;
        }
      });
    values.reverse()

    var top = "";
    if(values.length <1) {
        top = `⋆ ** Atualmente ninguém possui advertências!**`
    }
    else {
        values.length = 5
        for (var i in values) {
            await message.guild.members.fetch(values[i].id).then(infos => {
                top += `⋆ **${values.indexOf(values[i])+1}.** ${infos.user.username}#${infos.user.discriminator} : ${values[i].value}\n\n`;
            }) 
        }
    }
    const embed = new MessageEmbed()
        .setColor('#8257E5')
        .setTimestamp()
        .setTitle('🚀 Rocket - Top Advertências')
        .setDescription(`Em baixo será mostrado os 5 usuários que possuem mais advertências em nosso discord. Lembre-se que isto não é competição, advertências é algo sério.\n\n ${top}`)
        .setFooter({text: `Executado por ${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
    return message.reply({embeds: [embed]})
 
}

module.exports.help = {
    name: "topadvs",
    usage: "topadvs command"
}