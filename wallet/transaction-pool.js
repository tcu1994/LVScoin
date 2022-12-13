const Transaction = require("./transaction");

class TransactionPool {
    constructor(){
        this.transactions = [];

    }

    AddTransaction(transaction){
        console.log('dd', transaction)
        this.transactions.push(transaction);
    }
    replaceTransactionPool(tp){
        if (this.transactions.length <= tp.transactions.length){
            this.transactions = tp.transactions;
        }
        
    }

    validTransactions(){
        return this.transactions.filter( t => {
            const outputTotal = t.outputs.reduce((total, output) => {
                return total + output.amount;
            },0);
            if (t.input.amount !== outputTotal){
                console.log('invalid transaction!')
                return;
            }

            if (!Transaction.verifyTransaction(t)){
                console.log('invalid signature!');
                return;
            }
            return t;

        })

        

    }

    clear(){
        this.transactions = []
    }
}

module.exports = TransactionPool;