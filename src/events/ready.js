import Settings from '../configs/settings.json' assert { type: "json" };

const Event = {
    name: "ready",
    execute: async (client,interaction) => {
        console.log('🚀 Redshift is ready to use');

        const guild = client.guilds.cache.get(Settings.Guild_ID);
        if(!guild) return;

        const channel = guild.channels.cache.get(Settings.MemberCount_Channel);
        if(!channel) return;
        
        try {
            channel.edit({name:`🚀・Membros: ${guild.memberCount}`})
        } catch(err) {
            console.log('Ocorreu um problema ao editar o canal : ' + err)
        }
    }
}

export default Event;