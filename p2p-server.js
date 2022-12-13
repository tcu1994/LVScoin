const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') :  []

const MESSAGE_TYPES = {
    chain : 'CHAIN',
    transaction : 'TRANSACTION',
    clear : 'CLEAR'
}


class P2PServer {
    constructor (blockchain, transactionPool){
        console.log(transactionPool,'ssadasd')
        this.blockchain = blockchain
        this.transactionPool = transactionPool;
        this.sockets = []

    }

    listen(){
        const server = new Websocket.Server({port : P2P_PORT})
        server.on('connection', socket => this.connectSocket(socket))
        this.connectToPeers();
        console.log('listening for p2p connections on '+P2P_PORT)

    }

    connectToPeers(){
        peers.forEach(peer => {
            const socket = new Websocket(peer);

            socket.on('open', ()=> this.connectSocket(socket));


        })
    }


    connectSocket(socket){
        this.sockets.push(socket)
        console.log('Socket connected');

        this.messageHandler(socket);

        socket.send(JSON.stringify({ type : MESSAGE_TYPES.chain, chain : this.blockchain.chain}))
        socket.send(JSON.stringify({type :'TP', transactionPool : this.transactionPool}));
    }


    messageHandler(socket){
        socket.on('message', message => {
            const data = JSON.parse(message);

            switch(data.type){
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction:
                    console.log('d', data)
                    this.transactionPool.AddTransaction(data.transaction)
                    break

                case 'TP' : 
                    this.transactionPool.replaceTransactionPool(data.transactionPool)
                    break;
                case MESSAGE_TYPES.clear:
                    this.transactionPool.clear();
                    break;
            }





            console.log('data ', data);

            this.blockchain.replaceChain(data)


        })
    }

    syncChains(){
        this.sockets.forEach(socket => {
            socket.send(JSON.stringify(this.blockchain.chain));
        })
    }
    syncTP(){
        this.sockets.forEach(socket => {
            socket.send(JSON.stringify({type :'TP', transactionPool : this.transactionPool}));
        })
    }
    sendChain(socket){
        socket.send(JSON.stringify({ type : MESSAGE_TYPES.chain, chain : this.blockchain.chain}))
    }

    broadcastClearTransactions(){
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type : MESSAGE_TYPES.clear
        })))
    }


    sendTransaction(socket, transaction){
        socket.send(JSON.stringify({type : MESSAGE_TYPES.transaction, transaction: transaction}));
    }


    broadcastTransaction(transaction){
        this.sockets.forEach(socket => {
            this.sendTransaction(socket, transaction)
        })
    }

    

}

module.exports = P2PServer;