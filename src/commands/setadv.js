import {MessageEmbed} from 'discord.js';
import settings from '../configs/settings.json'
import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
var db = new JsonDB(new Config("ADVS", true, false, '/'));
module.exports.run = (Redshift, message, args) => {

    const user = message.mentions.members.first();

    if(!user) {
        return message.reply({content: 'Você precisa mencionar algum usuário'})
    }
    if(!args[1]) {
        return message.reply({content: 'Você precisa escolher uma quantidade!'})
    }
    if(args[1] >= 0 && args[1] <= settings.MAX_ADV_TOKICK) {
        db.push(`/${user.id}`,Number(args[1]))
        return message.reply({content: `${message.author} setou ${args[1]} advertências no(a) ${user}`})
    }
    else {
        return message.reply({content: `A quantidade fornecida é inválida coloque uma quantidade entre 0 e ${settings.MAX_ADV_TOKICK}`})
    }
}
module.exports.help = {
    name: "setadv",
    usage: "setav command for admins"
}