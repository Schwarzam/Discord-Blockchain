const SHA256 = require('crypto-js/sha256');

class Block{
  constructor(index, data, previousHash = '000', hash=undefined){
    this.index = index;
    this.timestamp = new Date().toUTCString();
    this.data = data;
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
}


class Blockchain{
  constructor(difficulty){
    this.chain = [this.createGenesis()];
    this.difficulty = difficulty;
  }

  createGenesis(){
    return new Block(0, "0")
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash;
    const res = newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);

    return res
  }

  isValidChain(){
    for(let i = 1; i < this.chain.length; i ++){
      const currentBlock = this.chain[i];
      const previouBlock = this.chain[i - 1];

      console.log(currentBlock.hash, "tei")
      console.log(currentBlock.calculateHash(), "tal")
      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if(currentBlock.previousHash !== previouBlock.hash){

        return false;
      }

      return true;
    }
  }
}

class Transaction{
  constructor(from, to, amount){
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
  
}

module.exports.Blockchain = Blockchain
module.exports.Block = Block