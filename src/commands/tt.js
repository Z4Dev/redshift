import SQLite  from "better-sqlite3"
import {  topTime } from "../events/toplevel";
import settings from "../configs/settings.json"
const sql = new SQLite("./src/score.sqlite", {fileMustExist: true})

module.exports.run = async (redshift) => {
  var sqliteHits = sql.prepare('SELECT * FROM leaderboard ORDER BY score DESC').all()
  var channel = redshift.channels.cache.get(settings.leaderboard)

  var memb1 = await redshift.users.fetch(sqliteHits[0].user)
  var memb2 = await redshift.users.fetch(sqliteHits[1].user)
  var memb3 = await redshift.users.fetch(sqliteHits[2].user)
  
  channel.send(`
    **TOP SEMANAL** :trophy:
Parabéns aos colocados desta semana! A Sua atividade no grupo ajuda a manter a comunidade em pé, sem vocês e muitos outros nós não estariamos aqui.

🥇 <@${memb1.id}> | **${sqliteHits[0].score}** pontos
🥈 <@${memb2.id}> | **${sqliteHits[1].score}** pontos
🥉 <@${memb3.id}> | **${sqliteHits[2].score}** pontos
  `)
  topTime(memb1, memb2, memb3, settings.leaderboard, redshift)
};

module.exports.help = {
    name: "tt",
    usage: "Clear command for admins"
}