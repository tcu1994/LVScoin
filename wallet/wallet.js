
const { captureRejectionSymbol } = require('ws');
const ChainUtil = require('../chain-util')
const Transaction = require('./transaction')
class Wallet {
    constructor(){
        this.balance = 10;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');

    }

    toString(){
        return `Wallet -
            publicKey : ${this.publicKey.toString()}
            balance: ${this.balance}`
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount,blockchain, transactionPool){
        this.balance = this.calculateBalance(blockchain,transactionPool)
        if (amount > this.balance){
            console.log('balance too low!');
            return;
        }
        console.log(transactionPool)
        let transaction = Transaction.newTransaction(this, recipient, amount);
        transactionPool.AddTransaction(transaction);


        return transaction
    }
    static blockchainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.address = 'YEeee';
        return blockchainWallet;

    }

    calculateBalance(blockchain,tp){
        let balance = this.balance;
        let transactions = []
        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            transactions.push(transaction)
        }))
        
        const walletInputTs = transactions.filter(t => t.input.address == this.publicKey)
        let recentInputT
        let startTime = 0;
        if (walletInputTs.length > 0){
            recentInputT = walletInputTs.reduce( (prev, curr) => prev.input.timestamp > curr.input.timestamp ? prev: curr);
            balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
            startTime = recentInputT.input.timestamp;
            transactions.forEach(t => {
                if (t.input.timestamp > startTime){
                    t.outputs.find(output => {
                        if (output.address === this.publicKey){
                            balance += output.amount;
                        }
                    })
                }
            })
        }else{
            
        }
        return balance
        


    }










}
module.exports = Wallet;