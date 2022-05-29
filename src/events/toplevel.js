import Canvas  from"canvas";
import blueapi from "blueapi.js";
import path from "path";
import Discord  from"discord.js";
import settings from "../configs/settings.json"


export const topTime = async (member1, member2, member3, cid, redshift) => {
  try {
    if (!member1 ) return;
    // const memberNickname =
    //     member.user.username > 11
    //         ? member.user.username.substring(0, 11)
    //         : member.user.username;

    const canvas = Canvas.createCanvas(1080, 1080);
    const context = canvas.getContext("2d");
    Canvas.registerFont(
        path.resolve() + "/src/fonts/phonkContrast.ttf",
        {
            family: "phonkContrast",
        }
    );

    context.font = "220px phonkContrast";
    const bg = await Canvas.loadImage(
        settings.topImage
    );

    const avatarMask = await Canvas.loadImage(
        settings.topMask
    );

    context.drawImage(bg, 0, 0, canvas.width, canvas.height);
    const avatar1 = await Canvas.loadImage(
        await blueapi.image.circle(`https://cdn.discordapp.com/avatars/${member1.id}/${member1.avatar}?size=1024`)
    );

    const avatar2 = await Canvas.loadImage(
        await blueapi.image.circle(`https://cdn.discordapp.com/avatars/${member2.id}/${member2.avatar}?size=1024`)
    );


    const avatar3 = await Canvas.loadImage(
        await blueapi.image.circle(`https://cdn.discordapp.com/avatars/${member3.id}/${member3.avatar}?size=1024`)
    );
    const formatName = (name) => {
      return name.toString().length >= 10 ?  
        name.slice(0, 10) + '..'
      :
        name
    }
    context.drawImage(avatar1, 410, 410, 244, 244);
    context.drawImage(avatar2, 100, 495, 244, 244);
    context.drawImage(avatar3, 730, 495, 244, 244);


    context.drawImage(avatarMask, 0, 0, 1080, 1080);
    context.beginPath();

    context.arc(122, 125, 99, 0, Math.PI * 2, true);
    context.closePath();
    context.beginPath();
    context.arc(122, 125, 99, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = "#ffffff";
    // context.fillText(
    //     formatName(memberNickname),
    //     canvas.width / 3.1,
    //     canvas.height / 1.9 + 1
    // );

    const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        `welcome_ac.png`
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
            });
    } catch (error) {
        console.log(error);
    }
} catch (e) {
    console.log(e);
}
}
