
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { Client, Collection } from "discord.js";
import intents from "./configs/intents";
import partials from "./configs/partials";
import settings from "./configs/settings.json"

const Redshift = new Client({
  partials: partials,
  intents: intents,
  ws: { intents: intents },
});

Redshift.command = new Collection();
Redshift.events = new Collection();
["events"].forEach(handler => {
  require(`./handlers/${handler}.js`)(Redshift);
});

fs.readdir(path.join(__dirname + '/commands'), (err, files) => {
  if (err) return console.log(err);
  let jsFiles = files.filter(f => f.split(".").pop() === "js")

  if (jsFiles.length <= 0)  return console.log("No Commands loaded.")

  jsFiles.forEach((f,i) => {
    let props = require(__dirname + `/commands/${f}`)
    console.log(`${i + 1}: ${f.toUpperCase()} is loaded.`);

    Redshift.command.set(f, props)
  })
});


dotenv.config();
Redshift.login(process.env.TOKEN)