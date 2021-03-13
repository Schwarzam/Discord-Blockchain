const SHA256 = require('crypto-js/sha256');
const { randomizeInteger } = require('./random.js')

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
}


class Blockchain{
  constructor(difficulty){
    this.chain = [this.createGenesis()];
    this.difficulty = difficulty;
    this.pendingTransactions = [];
    this.miningReward = randomizeInteger(20,100);
  }

  createGenesis(){
    return new Block(0, "0")
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1]
  }

  // addBlock(newBlock){
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   const res = newBlock.mineBlock(this.difficulty);
  //   this.chain.push(newBlock);
  //   return res
  // }


  miningPendingTransaction(miningRewardAddress){
    let block = new Block(this.pendingTransactions);
    block.mineBlock(this.difficulty);
    console.log('Block mined!')

    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ]
  }

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address){
    let balance = 0;

    for(const block of this.chain){
      
        if (block.transactions !== 0){
          console.log(block)
          for(const trans of block.transactions){
              if(trans.from === address){
                balance -= trans.ammount;
              }

              if(trans.to === address){
                balance += trans.ammount;
              }
            }
        }



      
    }

    return balance
  }
  


  isValidChain(){
    for(let i = 1; i < this.chain.length; i ++){
      const currentBlock = this.chain[i];
      const previouBlock = this.chain[i - 1];

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
    this.ammount = amount;
  }

}

let OuiCoin = new Blockchain(3);


OuiCoin.createTransaction(new Transaction('add1', 'add2', 20));
OuiCoin.createTransaction(new Transaction('add2', 'add1', 10));

console.log('miner...')
OuiCoin.miningPendingTransaction('mcart')
console.log(OuiCoin.getBalanceOfAddress('mcart'))

console.log('miner again...')
OuiCoin.miningPendingTransaction('mcart')
console.log(OuiCoin.getBalanceOfAddress('mcart'))

module.exports.Blockchain = Blockchain
module.exports.Block = Block