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

// Your private key goes here
const myKey = ec.keyFromPrivate('7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');
// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');

console.log("myWalletAddress", myWalletAddress)
// Mine first block
OuiCoin.miningPendingTransaction(myWalletAddress);
// Create a transaction & sign it with your key
const tx1 = new Transaction(myWalletAddress, 'address2', 10);
tx1.signTransaction(myKey);
OuiCoin.addTransaction(tx1);
// Mine block
OuiCoin.miningPendingTransaction(myWalletAddress);
// Create second transaction
const tx2 = new Transaction(myWalletAddress, 'address1', 10);
tx2.signTransaction(myKey);
OuiCoin.addTransaction(tx2);
// Mine block
OuiCoin.miningPendingTransaction(myWalletAddress);

console.log();
console.log(`Balance of gustavo is ${OuiCoin.getBalanceOfAddress(myWalletAddress)}`);

// Uncomment this line if you want to test tampering with the chain
// savjeeCoin.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
console.log();
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

