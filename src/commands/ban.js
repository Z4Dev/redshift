import {MessageEmbed,MessageActionRow,MessageButton} from 'discord.js'
import settings from '../configs/settings.json'
module.exports.run = async (RedShift, message, args) => {
    if (!message.member.roles.cache.some(role => role.id === settings.STAFF_ROLE)) return message.reply("Você não tem permissão para usar esse commando.");
    try {
        if (!args[0]) return message.reply({content: `Você precisa **mencionar** algum usuário ou o **id** de algum usuário`})

        const user = message.mentions.members.first() || await message.guild.members.fetch(args[0]),
        reason = args.slice(1).join(' ') || 'Nenhuma razão foi especificada';
        if (!user) return message.reply({content: `Você precisa **mencionar** algum usuário ou o **id** de algum usuário` })

        if (user == `${RedShift.user}` || user == `${RedShift.user.id}`) {
            return message.reply({content: "Me desculpe mas não você não pode me banir!"})
        }

        if (user == `${message.author}` || user == `${message.author.id}`) {
            return message.reply({content: "Você não pode se banir!"})
        }

        if (!user.bannable) return message.reply({content: "Ocorreu um problema ao tentar banir esse usuário, talvez ele tenha um cargo maior ou igual ao meu, ou eu não tenho permissão suficiente para banir"});
        if (message.member.roles.highest.position <= user.roles.highest.position) {
            return message.channel.send({content: `Me desculpe mas não consigo banir o usuário ${user} porque ele possui um cargo maior ou igual ao seu!`})
        }

        const embedconfirm = new MessageEmbed()
            .setColor('#8257E5')
            .setTitle(`🚀 Rocket Roleplay - Banimento`)
            .setDescription(`${message.author} deseja realmente banir ${user}?`)
            .addField(`Clique em __Confirmar__ para:`, `> Confirmar o banimento!`, true)
            .setFooter({text: `${message.author.tag}`,iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setTimestamp()

        const embed = new MessageEmbed()
            .setTitle(`🚀 Rocket Roleplay - Banimento`)
            .setColor("#8257E5")
            .setTimestamp()
            .addField('Ação:', "Banimento")
            .addField('Usuario:', `${user}`)
            .addField('Moderador:', `<@!${message.author.id}>`)
            .addField('Razão', `${reason}`)
            .setFooter({text: message.author.tag,iconURL: message.author.displayAvatarURL({dynamic: true})})

        const row = new MessageActionRow()

        const button = new MessageButton()
            .setCustomId("Ban")
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
                case "Ban": {
                    message.guild.members.ban(user, {
                        reason: reason,
                        days: 0
                    })
                    msg.delete({timeout: 9000});
                    message.guild.channels.cache.get(settings.ChannelPunishments).send({embeds: [embed]})
                    return message.channel.send({embeds: [embed]});
                }
                case "Cancelar": {
                    msg.delete({timeout: 9000});
                    return message.channel.send({content: `${message.author} cancelou o banimento com sucesso!`})
                }
            }
        })
    } catch (error) {
        return message.reply({ content: `Ocorreu um problema ao encontrar um usuário com esse id !`})
    }
}
module.exports.help = {
    name: "ban",
    usage: "Ban command for admins"
}