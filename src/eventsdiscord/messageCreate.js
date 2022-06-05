import settings from "../configs/settings.json"
import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
module.exports = async (Redshift,message) => {
    const regex = new RegExp(`(\\b|\\d)(${settings.ForbiddenWords.join('|')})(\\b|\\d)`, 'i');
    if (regex.test(message.content)) {
        message.delete();
        var db = new JsonDB(new Config("ADVS", true, false, '/'));
        db.reload()
        try {
            var data = db.getData(`/${message.author.id}`)
            db.push(`/${message.author.id}`, data+1)
            var data = db.getData(`/${message.author.id}`)
            if(data >= settings.MAX_ADV_TOKICK) {    
                let guild = Redshift.guilds.cache.get(settings.GROUP_ID);
                let member = guild.members.cache.get(message.author.id);
                member.kick() .then(() => {
                    message.channel.send(`**Taxado!** ${message.author} não seguiu as regras e acaba de ser kickado com **${data}** advertencias :wave:`)
                    db.delete(`/${message.author.id}`)
                })
                .catch(err => {
                    db.push(`/${message.author.id}`, 10)
                    return message.channel.send(`Ocorreu um problema ao tentar kickar ${message.author}, talvez eu não tenho permissões suficientes para kickar esse usuário!`)
                });       
            }
            else {
                message.channel.send(`${message.author} Não fale isso! uma **bad-word** foi detectada, você agora tem **${data}** advertencias de ${settings.MAX_ADV_TOKICK}.`).then((m) => {
                    setTimeout(() => {
                        m.delete()
                    }, 7500)
                });
            }
        } catch(error) {
            db.push(`/${message.author.id}`,1);
            var data = db.getData(`/${message.author.id}`)
            
            message.channel.send(`${message.author} Não fale isso! uma **bad-word** foi detectada, você agora tem **${data}** advertencias de ${settings.MAX_ADV_TOKICK}.`).then((m) => {
                setTimeout(() => {
                    m.delete()
                }, 7500)
            });
        }
    }

    let score;
    if (!regex.test(message.content)) { 
      if (message.author.bot) return;
     
      if (!settings.ignoreIDS.find(id => id === message.author.id))  {
      if (message.guild) {
        score = Redshift.getScore.get(message.author.id);
   
        if (!score) {
          score = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, score: 0 }
        }
  
        score.score = score.score + 10;
        Redshift.setScore.run(score);
      }
    }
  };  

    if (!message.content.startsWith(settings.PREFIX)  || message.author.bot) return null;
    

    const args = message.content.slice(settings.PREFIX.length).split(/ +/);
    const command = args.shift().toLowerCase();
    let cmd = Redshift.command.get(command+".js");

    if (cmd) {
      cmd.run(Redshift, message, args, settings.PREFIX)
    } else {
      command && message.reply("Este comando é inválido ou inexistente.")
    }
}