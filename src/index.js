import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import SQLite  from "better-sqlite3"
import { Client, Collection } from "discord.js";
import moment from "moment-timezone"

// Configs
import settings from "./configs/settings.json"
import intents from "./configs/intents";
import partials from "./configs/partials";
import { welcomeMessage } from "./events/welcome";
import {  topTime } from "./events/toplevel";


const Redshift = new Client({
  partials: partials,
  intents: intents,
  ws: { intents: intents },
});

const sql = new SQLite("./src/score.sqlite", {fileMustExist: true})

Redshift.command = new Collection();



const adv = []

fs.readdir(path.join(__dirname + '/commands'), (err, files) => {
  if (err) return console.log(err);
  let jsFiles = files.filter(f => f.split(".").pop() === "js")

  if (jsFiles.length <= 0)  return console.log("No Commands loaded.")

  jsFiles.forEach((f,i) => {
    let props = require(`./commands/${f}`)
    console.log(`${i + 1}: ${f.toUpperCase()} is loaded.`);

    Redshift.command.set(f, props)
  })
});


Redshift.on("ready", async (e) => {
  console.log("Redshift is online")
  
  Redshift.getScore = sql.prepare("SELECT * FROM leaderboard WHERE user = ?");
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
    let memberCount = server.memberCount;
    Redshift.channels.fetch(settings.memberCount).then(channel => channel.setName(memberCount  + " Astronautas  💜"))
  }, 60000);
});



Redshift.on("messageCreate", async message => {  
    const regex = new RegExp(`(\\b|\\d)(${settings.ForbiddenWords.join('|')})(\\b|\\d)`, 'i');
    if (regex.test(message.content)) {
      message.delete();

      const findAvs = adv.findIndex(userid => userid.id === message.author.id)
      if (findAvs === -1 ) {
        adv.push({id: message.author.id, adv: 1 })
      } else {
        adv[findAvs].adv = adv[findAvs].adv + 1 
      }
      

      if (adv[findAvs] && adv[findAvs].adv >= settings.MAX_ADV_TOKICK) {
        message.channel.send(`**Taxado!** ${message.author} não seguiu as regras e acaba de ser kickado com **${adv[findAvs].adv}** advertencias :wave:`)

        let guild = Redshift.guilds.cache.get(settings.GROUP_ID);
        let member = guild.members.cache.get(adv[findAvs].id);

        member.kick();
        return adv.splice(adv.indexOf(findAvs), 1);
      }

      message.channel.send(`${message.author} Não fale isso! uma **bad-word** foi detectada, você agora tem **${adv[findAvs] === undefined ? '1' : adv[findAvs].adv}** advertencias de ${settings.MAX_ADV_TOKICK}.`).then((m) => {
              setTimeout(() => {
                  m.delete()
          }, 7500)
      });
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
});


Redshift.on("guildMemberAdd", async (member) => {
  var role = member.guild.roles.cache.find(
      (r) => r.id === settings.AUTO_ROLE
  );

  Redshift.channels.cache.get(settings.BOARD_CHANNEL).send(`Hey, <@${member.user.id}> seja bem vindo(a), fique atento(a) as <#${settings.rules}> e fique de olho em <#${settings.anunc}> ou <#${settings.spoilers}>!`);
  welcomeMessage(member, settings.BOARD_CHANNEL, Redshift);
  
  member.roles.add(role);
});



dotenv.config();
Redshift.login(process.env.TOKEN)