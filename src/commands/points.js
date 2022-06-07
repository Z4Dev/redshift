module.exports.run = async (redshift, message, args, prefix) => {
  const user = message.mentions.members.first() || message.author


  if (!user.user) {
    return message.reply("Você precisa mencionar um membro antes.")
  }
  const points = redshift.getScore.get(user.user.id)

  if (!points) {
    return message.channel.send(`<@${user.user.id}> Não possui pontos.`)
  }

  message.channel.send(`<@${user.user.id}> possui atualmente **${redshift.getScore.get(user.user.id).score}** pontos.`)
};

module.exports.help = {
    name: "points",
    usage: "Mostra os pontos de algum usuário!",
    type: "normal"
}