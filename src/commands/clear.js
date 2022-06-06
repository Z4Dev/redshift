import settings from "../configs/settings.json"


module.exports.run = async (redshift, message, args, prefix) => {
    if (!message.member.roles.cache.some(role => role.id === settings.STAFF_ROLE)) return message.reply("Você não tem permissão para usar esse comando.");
    if (!args[0]) return message.reply("Você precisa digitar a quantidade de mensagens para deletar.");
    if (parseInt(args[0]) >= 101) return message.reply("O numero máximo de messages para deletar é 100.");
    if (isNaN(parseInt(args[0]))) return message.reply("Você precisa digitar um numero válido de mensagens.");

    await message.channel.bulkDelete(parseInt(args[0]), true).then((_message) => {
        message.channel.send(`${message.author} acaba de deletar **${args[0]}** mensagens.`)
    })
};

module.exports.help = {
    name: "clear",
    usage: "Clear command for admins"
}