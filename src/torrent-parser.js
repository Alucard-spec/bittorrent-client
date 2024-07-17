'use strict';

import fs from "fs";
import bencode from "bencode";
import BN from "bn.js";


import crypto from "crypto";

export const BLOCK_LEN= Math.pow(2,14);

export function pieceLen(torrent , pieceIndex){

    //Review this line
    const buffer=size(torrent);
    const totalLength= new BN(buffer).toNumber();

    const pieceLength= torrent.info['piece length'];
    
    const lastPieceLength= totalLength%pieceLength;
    const lastPieceIndex= Math.floor(totalLength/pieceLength);
    return lastPieceIndex===pieceIndex?lastPieceLength:pieceLength;


};

export function blocksPerPiece(torrent,pieceIndex){
    const pieceLength= pieceLen(torrent, pieceIndex);
    return Math.ceil(pieceLength/BLOCK_LEN);

};

export function blocKLen(torrent,pieceIndex,blockIndex){
        const pieceLength= pieceLen(torrent,pieceIndex);
        const lastPieceLength= pieceLength%BLOCK_LEN;
        const lastPieceIndex= Math.floor(pieceLength/BLOCK_LEN);
        
        return blockIndex===lastPieceIndex?lastPieceLength:BLOCK_LEN;


};

export function open (filepath){
    return bencode.decode(fs.readFileSync(filepath));

};
export function size(torrent){
const size= torrent.info.files? torrent.info.files.map(file => file.length).reduce((a,b)=>a+b):torrent.info.length;

//Modified code Debug in case of error

const bn = new BN(size);
return bn.toBuffer('be',8);

};

export function infoHash(torrent){
    
    const info = bencode.encode(torrent.info);
    return crypto.createHash('sha1').update(info).digest();
};


