import SQLite  from "better-sqlite3";
const sql = new SQLite("./src/score.sqlite", {fileMustExist: true});
import moment from "moment-timezone";
import settings from "../configs/settings.json"

import { numberToEmoji } from "../utils/numberToEmoji";

module.exports = (async Redshift => {

    console.log("Redshift is online")
  
    Redshift.getScore = sql.prepare("SELECT * FROM leaderboard WHERE user = ?");
    Redshift.allScores = sql.prepare("SELECT * FROM leaderboard");
    Redshift.setScore = sql.prepare("INSERT OR REPLACE INTO leaderboard (id, user, score) VALUES (@id, @user, @score);");
  
    setInterval(() => {
      let date = new Date
      let data = moment.tz(date, "America/Sao_Paulo");
      let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]  
  
      if(weekday === "Mon") {
        if (data.hour() === 16) {
          Redshift.command.get("tt.js").run(Redshift)
        }
      }
    }, 1.8e+7);

    const guild = Redshift.guilds.cache.get(settings.GROUP_ID);
    if (guild) {
      const memberCount = (await guild.members.fetch()).filter(m => !m.user.bot).size;
      const rck_roxo_emoji = Redshift.emojis.cache.get("984914808107323462");
      const channel = guild.channels.cache.get(settings.memberCount);
      if (!channel) return;
      
      channel.edit({ topic: `${rck_roxo_emoji || `🚀`}・${numberToEmoji(memberCount)} Astronautas` });
      setInterval(async () => {
        const memberCount = (await guild.members.fetch()).filter(m => !m.user.bot).size;
        channel.edit({ topic: `${rck_roxo_emoji || `🚀`}・${numberToEmoji(memberCount)} Astronautas` });
      }, 330000)
    }
});
