import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { Client, Collection } from "discord.js";

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
})


Redshift.on("message", async message => {  
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

    if (!message.content.startsWith(settings.PREFIX)  || message.author.bot) return null;

    const args = message.content.slice(settings.PREFIX.length).split(/ +/);
    const command = args.shift().toLowerCase();
    let cmd = Redshift.command.get(command+".js");

    if (cmd) {
      cmd.run(Redshift, message, args, settings.PREFIX)
    } else {
      const fetchUser =  id => Redshift.users.fetch(id)

      
//       let member1 = await fetchUser("667938764575866900");
//       let member2 = await fetchUser("824079236239065088");
//       let member3 = await fetchUser("389089969911889920");

//       Redshift.channels.cache
//       .get(settings.BOARD_CHANNEL).send(`> Parabéns aos tops semanais!! :trophy: 

// 🥇 <@${member1.id}> | Com **4096** mensagens
// 🥈 <@${member2.id}> | Com **4000** mensagens
// 🥉 <@${member3.id}> | Com **3096** mensagens`);

//       topTime(member1, member2, member3, settings.BOARD_CHANNEL, Redshift);


      command && message.reply("Este comando é inválido ou inexistente.")
    }
});


Redshift.on("guildMemberAdd", async (member) => {
  var role = member.guild.roles.cache.find(
      (r) => r.id === settings.AUTO_ROLE
  );


  Redshift.channels.cache.get(settings.BOARD_CHANNEL).send(`Hey, <@${member.user.id}> seja bem vindo(a), fique atento(a) as #regras e fique de olho em #anuncios ou #spoilers!`);
  welcomeMessage(member, settings.BOARD_CHANNEL, Redshift);
  
  member.roles.add(role);
});


dotenv.config();
Redshift.login(process.env.TOKEN)