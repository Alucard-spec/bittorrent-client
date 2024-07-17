'use strict';

import {BLOCK_LEN,blocKLen,blocksPerPiece,infoHash,open,pieceLen,size} from "./torrent-parser.js";


class Queue{
    constructor(torrent){
        this._torrent= torrent;
        this._queue= [];
        this.choked=true;
    }

    queue(pieceIndex){
        const nBlocks= blocksPerPiece(this._torrent,pieceIndex);
        for(let i=0;i<nBlocks;i++){
                const pieceBlock= {
                    index:pieceIndex,
                    begin:i*BLOCK_LEN,
                    length:blocKLen(this._torrent,pieceIndex,i)
                };
            this._queue.push(pieceBlock);
        }
    }

    deque(){
        return this._queue.shift();
    }

    peek(){
        return this._queue[0];
    }

    length(){
        return this._queue.length;
    }


}