const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require("node-fetch");

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const SHA256 = require('crypto-js/sha256')

const { Block } = require('./block.js'); 
const { Blockchain } = require('./blockchain.js');
const { Transaction } = require('./transaction.js');

let OuiCoin = new Blockchain(3);

console.log('Blockchain valid?', OuiCoin.isChainValid());


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
    try{
      if (msg.author.id != client.user.id) {
      }

      if (msg.content.startsWith('$transfer')){
        console.log(msg.author.id);
        var transfer = msg.content.split(' ');
        const myKey = ec.keyFromPrivate(msg.author.id);
        const myWalletAddress = myKey.getPublic('hex');
        const hisKey = ec.keyFromPrivate(transfer[1].toString().replace('<@!', '').replace('>', ''));
        const hisWalletAddress = hisKey.getPublic('hex');
        const tx2 = new Transaction(myWalletAddress, hisWalletAddress, Number(transfer[2]));
        tx2.signTransaction(myKey);
        res = OuiCoin.addTransaction(tx2);
        console.log(tx2)
        if (res.startsWith('Transaction added')){
          msg.channel.send(res);
        }else{
          msg.channel.send(res);
        }
      }

      if (msg.content.startsWith('$mine')){ 
        const myKey = ec.keyFromPrivate(msg.author.id);
        const myWalletAddress = myKey.getPublic('hex');

        res = OuiCoin.miningPendingTransaction(myWalletAddress);
        msg.channel.send(res);
      }

      if (msg.content.startsWith('$balance')){ 
        const myKey = ec.keyFromPrivate(msg.author.id);
        const myWalletAddress = myKey.getPublic('hex');

        console.log(myWalletAddress)
        msg.channel.send(`Balance of gustavo is ${OuiCoin.getBalanceOfAddress(myWalletAddress)}`);
      }

      if (msg.content.startsWith('$chain')){
        msg.channel.send("End of the chain: ");

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
            console.log(obj);

            embed.addFields(
              {name: 'prevHash: ', value: obj.previousHash, inline: true},
              {name: 'hash: ', value: obj.hash, inline: true},
              {name: '...', value: '...', inline: false},
            )
        })

        msg.channel.send(embed);
      }
    }catch{
      console.log("Error on request")
    }


});

client.login(process.env.DISCORD_BOT_SECRET);

