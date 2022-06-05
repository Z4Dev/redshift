const { readdirSync } = require("fs"); 

module.exports = (Redshift) => {
    const eventFiles = readdirSync('src/eventsdiscord').filter(f => f.endsWith('.js'));
    for (let i = 0; i < eventFiles.length; i++) {
      const event = require(`../eventsdiscord/${eventFiles[i]}`);
      const name = eventFiles[i].split(".")[0];
      Redshift.events.set(name, event);
      Redshift.on(name, (...args) => Redshift.events.get(name)(Redshift, ...args));
    }
}
