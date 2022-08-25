import settings from "../configs/settings.json"
import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

import { addMemberAdv } from '../utils/addAdv'
import { hasTextCapslockAbuse } from "../events/msg_capslock"
const capslockAlerts = {}

module.exports = async (Redshift,message) => {
    const regex = new RegExp(`(\\b|\\d)(${settings.ForbiddenWords.join('|')})(\\b|\\d)`, 'i');
    const db = new JsonDB(new Config("ADVS", true, false, '/'));
    db.reload()
    
    if (regex.test(message.content)) {
      try {
        const advs = (await db.getData(`/${message.author.id}`)) + 1

        if (advs >= settings.MAX_ADV_TOKICK) {
          addMemberAdv(Redshift, message)
          .then(() => {
            message.channel.send(`**Taxado!** ${message.author} não seguiu as regras e acaba de ser kickado com **${advs}** advertências :wave:`)
          })
          .catch((err) => {
            message.channel.send(`Ocorreu um problema ao tentar kickar ${message.author}, talvez eu não tenha permissões suficientes para kickar este usuário!`)
          })
        } else {
          await addMemberAdv(Redshift, message)
          message.channel.send(`${message.author} Não fale isso! uma **bad-word** foi detectada, você agora tem **${advs}** advertências. (${advs}/${settings.MAX_ADV_TOKICK})`).then((m) => {
            setTimeout(() => {
                m.delete()
            }, 7500)
          });
        }
      } catch(err) {
        await addMemberAdv(Redshift, message)
        message.channel.send(`${message.author} Não fale isso! uma **bad-word** foi detectada, você agora tem **1** advertência. (1/${settings.MAX_ADV_TOKICK})`).then((m) => {
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

        if (hasTextCapslockAbuse(message.content)) {
          if (!capslockAlerts[message.author.id]) {
            const rocket31 = message.guild.emojis.cache.get('974544899586285579')

            capslockAlerts[message.author.id] = {
              count: 1,
              last_message_tick: Date.now()
            };

            if (rocket31) {
              await message.react(rocket31)
            }
            await message.react('🇨')
            await message.react('🇦')
            await message.react('🇵')
            await message.react('🇸')
          } else {
            
            if (Date.now() - capslockAlerts[message.author.id].last_message_tick < 30 * 60 * 1000) {
              capslockAlerts[message.author.id].count++;
              capslockAlerts[message.author.id].last_message_tick = Date.now();

              switch (capslockAlerts[message.author.id].count) {
                case 2:
                  message.channel.send(`${message.author} cuidado com o abuso de capslock!`);
                  break;
              
                case 3:
                  message.channel.send(`${message.author} não abuse do capslock! Caso continue, você será punido!`);
                  break;

                case 4:
                  capslockAlerts[message.author.id] = undefined

                  try {
                    const advs = (await db.getData(`/${message.author.id}`)) + 1

                    if (advs >= settings.MAX_ADV_TOKICK) {
                      addMemberAdv(Redshift, message)
                      .then(() => {
                        message.channel.send(`**Taxado!** ${message.author} não seguiu as regras e acaba de ser kickado com **${advs}** advertências :wave:`)
                      })
                      .catch((err) => {
                        message.channel.send(`Ocorreu um problema ao tentar kickar ${message.author}, talvez eu não tenha permissões suficientes para kickar este usuário!`)
                      })
                    } else {
                      await addMemberAdv(Redshift, message)
                      message.channel.send(`${message.author} você está recebendo uma advertência por abuso de capslock! Você agora tem **${advs}** advertências. (${advs}/${settings.MAX_ADV_TOKICK})`).then((m) => {
                        setTimeout(() => {
                            m.delete()
                        }, 7500)
                      });
                    }
                  } catch(err) {
                    await addMemberAdv(Redshift, message)
                    message.channel.send(`${message.author} você está recebendo uma advertência por abuso de capslock! Você agora tem 1 advertência. (1/${settings.MAX_ADV_TOKICK})`).then((m) => {
                      setTimeout(() => {
                          m.delete()
                      }, 7500)
                    });
                  }
                  break;

                default:
                  break;
              }
            } else {
              capslockAlerts[message.author.id].count = 1;
              capslockAlerts[message.author.id].last_message_tick = Date.now();
            }
          }
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