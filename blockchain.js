const { randomizeInteger } = require('./random.js')

const { Block } = require('./block.js'); 
const { Transaction } = require('./transaction.js');
const EC = require('elliptic').ec;

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
    let block = new Block(this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty, this.ge);
    console.log('Block mined!')

    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ]
  }

  addTransaction(transaction){
    if (!transaction.from || !transaction.to) {
      console.log('Transaction must include from and to address');
    }

    if (!transaction.isValid()) {
      console.log('Cannot add invalid transaction to chain');
    }
    
    if (transaction.amount <= 0) {
      console.log('Transaction amount should be higher than 0');
    }
    
    if (this.getBalanceOfAddress(transaction.from) < transaction.amount) {
      console.log('Not enough balance');
    }

    this.pendingTransactions.push(transaction);
    console.log('transaction added: %s', transaction);
  }

  getBalanceOfAddress(address){
    let balance = 0;

    for(const block of this.chain){
        if (block.transactions !== 0){
          
          for(const trans of block.transactions){
              if(trans.from === address){
                balance -= trans.amount;
              }

              if(trans.to === address){
                balance += trans.amount;
              }
            }
        }      
    }

    return balance
  }
  


  isChainValid(){
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {

        console.log("TEII", currentBlock.calculateHash(), currentBlock.hash)
        return false;
      }
    }

    return true;
  }
}


module.exports.Blockchain = Blockchain;
