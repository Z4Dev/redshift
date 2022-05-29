import Canvas  from"canvas";
import blueapi from "blueapi.js";
import path from "path";
import Discord  from"discord.js";
import settings from "../configs/settings.json"


export const welcomeMessage = async (member, cid, redshift) => {
  try {
    if (!member) return;
    const memberNickname =
        member.user.username > 11
            ? member.user.username.substring(0, 11)
            : member.user.username;

    const canvas = Canvas.createCanvas(2560, 1000);
    const context = canvas.getContext("2d");
    Canvas.registerFont(
        path.resolve() + "/src/fonts/phonkContrast.ttf",
        {
            family: "phonkContrast",
        }
    );

    context.font = "220px phonkContrast";
    const bg = await Canvas.loadImage(
        settings.joinImage
    );
    context.drawImage(bg, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(
        await blueapi.image.circle(
            member.user.displayAvatarURL({
                format: "png",
            })
        )
    );

    const formatName = (name) => {
      return name.toString().length >= 10 ?  
        name.slice(0, 10) + '..'
      :
        name
    }

    context.drawImage(avatar, 175, 220, 551, 560);
    context.beginPath();

    context.arc(122, 125, 99, 0, Math.PI * 2, true);
    context.closePath();
    context.beginPath();
    context.arc(122, 125, 99, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = "#ffffff";
    context.fillText(
        formatName(memberNickname),
        canvas.width / 3.1,
        canvas.height / 1.9 + 1
    );

    const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        `welcome_${member.user.id}.png`
    );

    try {
        redshift.channels.cache
            .get(cid)
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
} catch (e) {
    console.log(e);
}
}
