
import SQLite  from "better-sqlite3";
const sql = new SQLite("./src/score.sqlite", {fileMustExist: true});
import moment from "moment-timezone";
import settings from "../configs/settings.json"
module.exports = (Redshift => {

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
  
    
    setInterval(() => {
      var server = Redshift.guilds.cache.get(settings.GROUP_ID);
      if (server) {
        let memberCount = server.memberCount;
        Redshift.channels.fetch(settings.memberCount).then(channel => channel.setName(memberCount  + " Astronautas  💜"))
      }
    }, 60000);
});
