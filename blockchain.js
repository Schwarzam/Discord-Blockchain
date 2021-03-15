const { randomizeInteger } = require('./random.js')

const { Block } = require('./block.js'); 
const { Transaction } = require('./transaction.js');
const EC = require('elliptic').ec;

class Blockchain{
  constructor(difficulty){
    this.chain = [this.createGenesis()];
    this.difficulty = difficulty;
    this.pendingTransactions = [];
  }

  createGenesis(){
    return new Block(new Date().toUTCString() , 0, "0")
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1]
  }

  miningPendingTransaction(miningRewardAddress){
    let block = new Block(new Date().toUTCString() ,this.pendingTransactions, this.getLatestBlock().hash);
    const res = block.mineBlock(this.difficulty);

    if (res.startsWith('C')){
      return res
    }else{
      this.chain.push(block);
      
      this.pendingTransactions = [
        new Transaction(null, miningRewardAddress, randomizeInteger(20,100))
      ]

      return res + " With value: " + randomizeInteger(20,100) + " OuiCoins";
    }
  }

  addTransaction(transaction){
    if (!transaction.from || !transaction.to) {
      return 'Transaction must include from and to address';
    }

    if (!transaction.isValid()) {
      return 'Cannot add invalid transaction to chain';
    }
    
    if (transaction.amount <= 0) {
      return 'Transaction amount should be higher than 0';
    }
    
    if (this.getBalanceOfAddress(transaction.from) < transaction.amount) {
      return 'Not enough balance';
    }

    this.pendingTransactions.push(transaction);
      return 'Transaction added: ' + transaction.signature;
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

        return false;
      }
    }

    return true;
  }
}


module.exports.Blockchain = Blockchain;
