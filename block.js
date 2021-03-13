const SHA256 = require('crypto-js/sha256');

class Block{
  constructor(index, data, previousHash = ''){
    this.index = index;
    this.timestamp = new Date().toUTCString();
    this.data = data;
    this.previousHash = previousHash
    this.hash = this.calculateHash();
  }

  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }

  mineBlock(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
      this.hash = this.calculateHash();

    }

    console.log("block mined" + this.hash)
  }
}


class Blockchain{
  constructor(){
    this.chain = [this.createGenesis()];
  }

  createGenesis(){
    return new Block(0, "0")
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isValidChain(){
    for(let i = 1; i < this.chain.length; i ++){
      const currentBlock = this.chain[i];
      const previouBlock = this.chain[i - 1];

      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      console.log(previouBlock, "tei")
      if(currentBlock.previousHash !== previouBlock.hash){
        return false;
      }

      return true;
    }
  }
}

let OuiCoin = new Blockchain;
OuiCoin.addBlock(new Block(1, {amount: 2}));
OuiCoin.addBlock(new Block(2, {amount: 4}));


console.log(OuiCoin.isValidChain())