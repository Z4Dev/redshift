import settings from "../configs/settings.json"
import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

import { addMemberAdv } from '../utils/addAdv'

const capslockAlerts = {};

export const add = async (Redshift, user, message) => {
    const db = new JsonDB(new Config("ADVS", true, false, '/'));
    db.reload()

    const timeNow = Date.now();
    
    if (!capslockAlerts[user.id]) {
        const rocket31 = message.guild.emojis.cache.get('974544899586285579')
        
        capslockAlerts[user.id] = {
            count: 1,
            last_message_tick: timeNow
        };

        if (rocket31) {
            await message.react(rocket31)
        }
        await message.react('🇨')
        await message.react('🇦')
        await message.react('🇵')
        await message.react('🇸')
        return
    }

    message.delete()

    if (timeNow - capslockAlerts[user.id].last_message_tick < 30 * 60 * 1000) {
        capslockAlerts[user.id].count++;
        capslockAlerts[user.id].last_message_tick = timeNow;

        switch (capslockAlerts[user.id].count) {
            case 2:
              message.channel.send(`${message.author} cuidado com o abuso de capslock!`).then((m) => {
                setTimeout(() => {
                  m.delete()
                }, 7500)
              });
              break;
          
            case 3:
              message.channel.send(`${message.author} não abuse do capslock! Caso continue, você será punido!`).then((m) => {
                setTimeout(() => {
                  m.delete()
                }, 7500)
              });
              break;

            case 4:
              capslockAlerts[user.id] = undefined

              try {
                const advs = (await db.getData(`/${message.author.id}`)) + 1

                if (advs >= settings.MAX_ADV_TOKICK) {
                  addMemberAdv(Redshift, message)
                  .then(() => {
                    message.channel.send(`**Taxado!** ${message.author} não seguiu as regras e acaba de ser kickado com **${advs}** advertências :wave:`).then((m) => {
                      setTimeout(() => {
                        m.delete()
                      }, 7500)
                    });
                  })
                  .catch((err) => {
                    message.channel.send(`Ocorreu um problema ao tentar kickar ${message.author}, talvez eu não tenha permissões suficientes para kickar este usuário!`).then((m) => {
                      setTimeout(() => {
                        m.delete()
                      }, 7500)
                    });
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
        capslockAlerts[user.id] = {
            count: 1,
            last_message_tick: timeNow,
        };
    }
};