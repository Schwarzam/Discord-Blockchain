const SHA256 = require('crypto-js/sha256');
const { randomizeInteger } = require('./random.js')

const EC = require('elliptic').ec;

class Block{
  constructor(transactions, previousHash = '000', hash=undefined){
    this.timestamp = new Date().toUTCString();
    this.transactions = transactions;
    this.previousHash = previousHash;
    if (hash){
      this.hash = hash
    }else{
      this.hash = this.calculateHash();
    }

    this.nonce = 0;
  }

  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty){
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
      this.hash = this.calculateHash();
      this.nonce ++;
    }

    return "block mined " + this.hash
  }

  hasValidTransactions() {
    for (const tran of this.transactions) {
      if (!tran.isValid()) {
        return false;
      }
    }

    return true;
  }
}

// let OuiCoin = new Blockchain(3);

// OuiCoin.createTransaction(new Transaction('add1', 'add2', 20));
// OuiCoin.createTransaction(new Transaction('add2', 'add1', 10));

// console.log('miner...')
// OuiCoin.miningPendingTransaction('mcart')
// console.log(OuiCoin.getBalanceOfAddress('mcart'))

// console.log('miner again...')
// OuiCoin.miningPendingTransaction('mcart')
// console.log(OuiCoin.getBalanceOfAddress('mcart'))

module.exports.Block = Block;