import settings from "../configs/settings.json"
import axios from "axios"

module.exports.run = async (redshift, message, args, prefix) => {
    if (!message.member.roles.cache.some(role => role.id === settings.STAFF_ROLE)) return message.reply("Você não tem permissão para usar esse comando.");
    if (!args[0]) return message.reply("Você precisa adicionar um link para encurtar.");

    const { data } = await axios.get("https://rck.life/short", {
      originUrl: args[0]
    });

    message.channel.send(`${message.author} Seu link encurtado está pronto: ${data.shortUrl}`)
};

module.exports.help = {
    name: "short",
    usage: "Short command for admins",
    type: "admin"
}