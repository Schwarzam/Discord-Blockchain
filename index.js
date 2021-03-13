const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require("node-fetch");

const SHA256 = require('crypto-js/sha256')

var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('dblite', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

client.on('ready', () => {
  console.log("I'm in");
  console.log(client.user.username);
});


client.on('message', msg => {
    if (msg.author.id != client.user.id) {
    }

    if (msg.content.startsWith('save')){
      const message = msg.content.split(' ')
      const link = message[1]
      const title = message[2]
      console.log(link, title)
      const embed = new Discord.MessageEmbed()
      msg.channel.send(embed);
    }

    if (msg.content.startsWith('ver p')){
      get_from_db(msg)
    }

    if (msg.content.startsWith('add p')){
      db.run(`INSERT INTO playlists (playlist) VALUES ('${playlist}') `, (err) => {
                    if (err) {
                      return console.error(err.message);
                    }
      })
    }

    if (msg.content.startsWith('create')){
      const play_name = msg.content.split(' ')
      const playlist = play_name[1]
      console.log(db)
      db.run(`
      CREATE TABLE IF NOT EXISTS playlists (
        playlist text NOT NULL
      );`, (err) => {
                    if (err) {
                      return console.error(err.message);
                    }
      })

      db.run(`INSERT INTO playlists (playlist) VALUES ('${playlist}') `, (err) => {
                    if (err) {
                      return console.error(err.message);
                    }
      })
      msg.channel.send(`PLAYLIST ${playlist} CREATED`)
    }
});

async function get_from_db(msg){
    const res = await db.get(`SELECT * from playlists;`);
    console.log(res)
}

client.login(process.env.DISCORD_BOT_SECRET);

