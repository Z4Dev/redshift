import { sendWelcome } from "../utils/sendWelcome.js";
import Settings from "../configs/Settings.json" assert { type: "json" };

const Event = {
    name: "guildMemberAdd",
    execute: async (client,member) => {
        sendWelcome(client,member)
        member.roles.add(Settings.JoinRole)
    }
}

export default Event;