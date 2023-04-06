import Canvas  from"canvas";
import blueapi from "blueapi.js";
import path from "path";
import {AttachmentBuilder} from "discord.js"; 
import Settings from "../configs/Settings.json" assert { type: "json" };
import jimp from 'jimp'

export const sendWelcome = async (client, member) => {
    try {
        if (!member) return;
        const canvas = Canvas.createCanvas(832,245);
        const context = canvas.getContext("2d");
        Canvas.registerFont(
            path.resolve() + "/src/fonts/phonkContrast.ttf",
            {
                family: "phonkContrast",
            }
        );

        context.font = "220px phonkContrast";
        const bg = await Canvas.loadImage(
            Settings.joinImage
        );
        context.drawImage(bg, 0, 0, canvas.width, canvas.height);
        const avatar = await Canvas.loadImage(
            await blueapi.image.circle(`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`)
        );

        const formatName = (name) => {
        return name.toString().length >= 9 ?  
            name.slice(0, 9) + '..'
        :
            name
        }

        context.drawImage(avatar, 81, 66, 114, 114);
        context.beginPath();

        context.arc(122, 125, 99, 0, Math.PI * 2, true);
        context.closePath();
        context.beginPath();
        context.arc(122, 125, 99, 0, Math.PI * 2, true);
        context.closePath();
        context.fillStyle = "#ffffff";

        const attachment = new AttachmentBuilder(
            canvas.toBuffer(),
            `welcome_${member.user.id}.png`
        );

        try {
            client.channels.cache
                .get(Settings.JoinChannel)
                .send({
                    files: [attachment],
                })
                .then((msg) => {
                    msg.react("💜");
                    msg.react("🚀");
                    msg.react("👨🏻‍🚀");
                });
        } catch (error) {
            console.log(error);
        }
    } catch (err) {
        console.log(err);
    }
}