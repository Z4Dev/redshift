import { welcomeMessage } from "../events/welcome";
import settings from "../configs/settings.json"
module.exports = (Redshift,member) => {
    var role = member.guild.roles.cache.find(
        (r) => r.id === settings.AUTO_ROLE
    );

    Redshift.channels.cache.get(settings.BOARD_CHANNEL).send(`Hey, <@${member.user.id}> seja bem vindo(a), fique atento(a) as <#${settings.rules}> e fique de olho em <#${settings.anunc}> ou <#${settings.spoilers}>!`);
    welcomeMessage(member, settings.BOARD_CHANNEL, Redshift);

    member.roles.add(role)
}