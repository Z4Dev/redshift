const {MessageEmbed, Message} = require('discord.js')
const {ChannelBoost} = require('../configs/settings.json')
module.exports = (Redshift, oldinfos,newinfos) => {
    const getchannelbost = Redshift.channels.cache.get(ChannelBoost)
    const checkboostold = oldinfos.premiumSince;
    const checkboostnew = newinfos.premiumSince;

    if(!checkboostold && checkboostnew) {
        const embednewboost = new MessageEmbed()
        .setColor('#8257E5')
        .setTitle(`🚀 Rocket Roleplay - Boost`)
        .setImage('https://media.discordapp.net/attachments/969275575803986003/982436425070952469/rocket_reprovadof.png')
        .setDescription(`> ${newinfos.user} acabou de dar __boost__ em nosso discord!`)
        getchannelbost.send({embeds: [embednewboost]}).then(msg => {
            msg.react('❤️')
        })
    }

}


