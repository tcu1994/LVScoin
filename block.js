
const SHA256 = require('crypto-js/sha256')

const DIFFICULTY = 4;



class Block {
    constructor(timestamp, lastHash, hash, data, nonce){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
    }
    toString(){
        return `Block -
        Timestamp: ${this.timestamp}
        Last hash: ${this.lastHash.substring(0,12)}
        Hash: ${this.hash.substring(0,12)}
        Nonce: ${this.nonce}
        Data: ${this.data}`;

    }
    static genesis(){
        return new this('First block time', '------', 'asdf', [], 0)
    }
    static hash(timestamp, lastHash, data, nonce){
        return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString();

    }
    static mineBlock(lastBlock, data){
        let hash, timestamp;
        const lastHash = lastBlock.hash
        let nonce = 0;
        do{
            nonce++;
            timestamp = Date.now()
            hash = Block.hash(timestamp, lastHash, data, nonce);
        }while(hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));
        
        

        return new this(timestamp, lastHash, hash, data, nonce);
    }

    

    static blockHash(block){
        const { timestamp, lastHash, data, nonce} = block;
        return Block.hash(timestamp, lastHash, data, nonce);

    }



}
module.exports = Block;