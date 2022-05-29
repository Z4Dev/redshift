import settings from "../configs/settings.json"
import { welcomeMessage } from "../events/welcome";

module.exports.run = async (redshift, message, args, prefix) => {
  const channel = message.channel

  let guild = redshift.guilds.cache.get(settings.GROUP_ID);
  let member = guild.members.cache.get(message.author.id);

   message.reply('ule')
  welcomeMessage(member, settings.BOARD_CHANNEL, redshift);
};

module.exports.help = {
    name: "mycard",
    usage: "Clear command for admins"
}