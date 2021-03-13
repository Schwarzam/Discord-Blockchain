const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require("node-fetch");

const SHA256 = require('crypto-js/sha256')

const { Blockchain, Block } = require('./block.js'); 

let OuiCoin = new Blockchain(3);

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

    if (msg.content.startsWith('$mine')){
      msg.channel.send("Mining Block...");
      const res = OuiCoin.addBlock(new Block(1, {amount: 2}));
      msg.channel.send(res);
    }

    if (msg.content.startsWith('$chain')){
      var arr = ''
      var cut = OuiCoin.chain.length
      if (cut > 5){
        arr = OuiCoin.chain.slice(Math.max(OuiCoin.chain.length - 5, 1));
      }else{
        arr = OuiCoin.chain;
      }
      const embed = new Discord.MessageEmbed()
      arr.forEach(function(objeto, i) {
          const obj = objeto;

          embed.addFields(
            {name: 'prevHash: ', value: obj.previousHash, inline: true},

            {name: 'hash: ', value: obj.hash, inline: true},

            {name: '...', value: '...', inline: false},
          )

      })

      msg.channel.send(embed);
    }


});

client.login(process.env.DISCORD_BOT_SECRET);

