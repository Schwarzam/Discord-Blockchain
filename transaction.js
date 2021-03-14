const SHA256 = require('crypto-js/sha256');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const { Block } = require('./block.js'); 
const { Blockchain } = require('./blockchain.js');

class Transaction{
  constructor(from, to, amount){
    this.from = from;
    this.to = to;
    this.amount = amount;
  }

  calculateHash(){
    return SHA256(this.from + this.to + this.amount).toString();
  }

  signTransaction(signingKey){
    if (signingKey.getPublic('hex') !== this.from) {
      console.log('You cannot sign transactions for other wallets!');
    }

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');
    this.signature = sig.toDER('hex');
  }

  isValid(){
    if (this.from === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    const publicKey = ec.keyFromPublic(this.from, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }

}

module.exports.Transaction = Transaction