import settings from "../configs/settings.json"
import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

import { hasTextCapslockAbuse } from "../events/msg_capslock"
import * as capslockAlerts from "../utils/capslockAlerts"

module.exports = async (Redshift,oldmessage, newmessage) => {


    const regex = new RegExp(`(\\b|\\d)(${settings.ForbiddenWords.join('|')})(\\b|\\d)`, 'i');
    if (regex.test(newmessage.content)) {
        newmessage.delete();
        var db = new JsonDB(new Config("ADVS", true, false, '/'));
        db.reload()
        try {
            var data = db.getData(`/${newmessage.author.id}`)
            db.push(`/${newmessage.author.id}`, data+1)
            var data = db.getData(`/${newmessage.author.id}`)
            if(data >= settings.MAX_ADV_TOKICK) {    
                let guild = Redshift.guilds.cache.get(settings.GROUP_ID);
                let member = guild.members.cache.get(newmessage.author.id);
                member.kick() .then(() => {
                    newmessage.channel.send(`**Taxado!** ${newmessage.author} não seguiu as regras e acaba de ser kickado com **${data}** advertencias :wave:`)
                    db.delete(`/${newmessage.author.id}`)
                })
                .catch(err => {
                    db.push(`/${newmessage.author.id}`, 10)
                    return newmessage.channel.send(`Ocorreu um problema ao tentar kickar ${newmessage.author}, talvez eu não permissões suficientes para kickar esse usuário!`)
                });       
            }
            else {
                newmessage.channel.send(`${newmessage.author} Não fale isso! uma **bad-word** foi detectada, você agora tem **${data}** advertencias de ${settings.MAX_ADV_TOKICK}.`).then((m) => {
                    setTimeout(() => {
                        m.delete()
                    }, 7500)
                });
            }
        } catch(error) {
            db.push(`/${newmessage.author.id}`,1);
            var data = db.getData(`/${newmessage.author.id}`)
            
            newmessage.channel.send(`${newmessage.author} Não fale isso! uma **bad-word** foi detectada, você agora tem **${data}** advertencias de ${settings.MAX_ADV_TOKICK}.`).then((m) => {
                setTimeout(() => {
                    m.delete()
                }, 7500)
            });
        }
    }
    
    if (await hasTextCapslockAbuse(newmessage.content)) {
        capslockAlerts.add(Redshift, newmessage.author, newmessage)
    }
}