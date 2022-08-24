import settings from "../configs/settings.json"

module.exports.run = (Redshift, message, args) => {
    if (!message.member.roles.cache.some(role => role.id === settings.STAFF_ROLE)) return message.reply("Você não tem permissão para usar esse comando.");
    let user = message.mentions.members.first();
    let time = Number(args[1]);
    let reason = args.slice(2).join(" ");

    if (user.roles.cache.some(role => role.id === settings.STAFF_ROLE)) return message.reply("Não tenho permissão para isto!");
    if(user.permissions.has("Administrator")) return message.reply("Não tenho permissão para isto!")
    if(!user) return message.reply("Você precisa mencionar um usuário!")
    if(!time) return message.reply("Você precisa colocar um tempo!")
    if (!reason) return message.reply("Você precisa colocar um motivo!")
            
    user.timeout(1000 * time, reason).then( timeout => {
        message.reply(`O membro \`${user.user.tag}\` foi punido por: \`${time}\` segundos, pelo motivo:\`${reason}\``)
    })
}

module.exports.help = {
    name: "timeout",
    usage: "Faça alguem fechar a matraca!",
    type: 'admin'
}