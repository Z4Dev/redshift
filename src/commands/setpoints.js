import settings from '../configs/settings.json'

module.exports.run = (Redshift, message, args) => {
    if (!message.member.roles.cache.some(role => role.id === settings.STAFF_ROLE)) return message.reply("Você não tem permissão para usar esse comando.");
    const user = message.mentions.users.first();
    if(!user) return message.reply("Você precisa mencionar algum usuário");
    if(!args[1]) return message.reply("Você precisa definir uma quantidade de pontos");
    if(!isNaN(args[1])) {
        let score;
        score = Redshift.getScore.get(user.id);
        if (!score) {
          score = { id: `${message.guild.id}-${user.id}`, user: user.id, score: args[1] }
        }    
        score.score = args[1];
        Redshift.setScore.run(score);
        message.reply(`Setou ${args[1]} pontos para o usuário ${user} com sucesso!`);
    }
    else {
        return message.reply("A quantidade deve ser um número!");
    }
}

module.exports.help = {
    name: "setpoints",
    usage: "Sete pontos para algum usuário",
    type: 'admin'
}