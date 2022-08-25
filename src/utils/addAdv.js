import settings from "../configs/settings.json"
import { Client, Message } from 'discord.js';
import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

/**
 * 
 * @param {Client} Redshift 
 * @param {Message} message 
 */
export const addMemberAdv = async (Redshift, message) => {
    const db = new JsonDB(new Config("ADVS", true, false, '/'));
    db.reload()
    try {
        let data = await db.getData(`/${message.author.id}`)
        data++;
        await db.push(`/${message.author.id}`, data)
        if(data >= settings.MAX_ADV_TOKICK) {
            return new Promise((resolve, reject) => {
                let guild = Redshift.guilds.cache.get(settings.GROUP_ID);
                let member = guild.members.cache.get(message.author.id);
                member.kick() .then(() => {
                    db.delete(`/${message.author.id}`)
                    resolve()
                })
                .catch(async err => {
                    const data = await db.getData(`/${message.author.id}`)
                    db.push(`/${message.author.id}`, data)
                    reject(err)
                    return
                });
            })
        }
    } catch(error) {
        db.push(`/${message.author.id}`,1);
    }
}