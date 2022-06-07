import {MessageEmbed,MessageActionRow,MessageButton} from 'discord.js'
import settings from '../configs/settings.json'
module.exports.run = async (RedShift, message, args) => {
    if (!message.member.roles.cache.some(role => role.id === settings.STAFF_ROLE)) return message.reply("Você não tem permissão para usar esse comando.");
    try {
        if (!args[0]) return message.reply({content: `Você precisa **mencionar** algum usuário ou o **id** de algum usuário`})

        const user = message.mentions.members.first() || await message.guild.members.fetch(args[0]),
        reason = args.slice(1).join(' ') || 'Nenhuma razão foi especificada';
        if (!user) return message.reply({content: `Você precisa **mencionar** algum usuário ou o **id** de algum usuário` })

        if (user == `${RedShift.user}` || user == `${RedShift.user.id}`) {
            return message.reply({content: "Me desculpe mas não você não pode me kickar!"})
        }

        if (user == `${message.author}` || user == `${message.author.id}`) {
            return message.reply({content: "Você não pode se kickar!"})
        }

        if (!user.kickable) return message.reply({content: "Ocorreu um problema ao tentar kickar esse usuário, talvez ele tenha um cargo maior ou igual ao meu, ou eu não tenho permissão suficiente para kickar"});
        if (message.member.roles.highest.position <= user.roles.highest.position) {
            return message.channel.send({content: `Me desculpe mas não consigo kickar o usuário ${user} porque ele possui um cargo maior ou igual ao seu!`})
        }

        const embedconfirm = new MessageEmbed()
            .setColor('#8257E5')
            .setTitle(`🚀 Rocket Roleplay - Kick`)
            .setDescription(`${message.author} deseja realmente kickar ${user}?`)
            .addField(`Clique em __Confirmar__ para:`, `> Confirmar o Kick!`, true)
            .setFooter({text: `${message.author.tag}`,iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setTimestamp()

        const embed = new MessageEmbed()
            .setTitle(`🚀 Rocket Roleplay - Kick`)
            .setColor("#8257E5")
            .setTimestamp()
            .addField('Ação:', "Kick")
            .addField('Usuario:', `${user}`)
            .addField('Moderador:', `<@!${message.author.id}>`)
            .addField('Razão', `${reason}`)
            .setFooter({text: message.author.tag,iconURL: message.author.displayAvatarURL({dynamic: true})})

        const row = new MessageActionRow()

        const button = new MessageButton()
            .setCustomId("Kick")
            .setEmoji('🚀')
            .setLabel("Confirmar")
            .setStyle("SUCCESS")
            .setDisabled(false)

        const button2 = new MessageButton()
            .setCustomId("Cancelar")
            .setEmoji('🔓')
            .setLabel("Cancelar")
            .setStyle("DANGER")
            .setDisabled(false)

        row.addComponents([button], [button2])

        const msg = await message.reply({embeds: [embedconfirm],components: [row],fetchReply: true
        })
        let collect;
        const filter = (interaction => {
            return interaction.isButton() && interaction.message.id === msg.id
        })
        const collector = msg.createMessageComponentCollector({
            filter: filter,
            time: 60000,
            max: 1
        });

        collector.on("collect", async (x) => {
            if (x.user.id != message.author.id) return x.update({
                ephemeral: true
            })
            x.deferUpdate()
            collect = x;
            switch (x.customId) {
                case "Kick": {
                    message.guild.members.kick(user, {
                        reason: reason,
                        days: 0
                    })
                    msg.delete({timeout: 9000});
                    message.guild.channels.cache.get(settings.ChannelPunishments).send({embeds: [embed]})
                    return message.channel.send({embeds: [embed]});
                }
                case "Cancelar": {
                    msg.delete({timeout: 9000});
                    return message.channel.send({content: `${message.author} cancelou o kick com sucesso!`})
                }
            }
        })
    } catch (error) {
        return message.reply({ content: `Ocorreu um problema ao encontrar um usuário com esse id !`})
    }
}
module.exports.help = {
    name: "kick",
    usage: "Kick command for admins",
    type: "admin"
}