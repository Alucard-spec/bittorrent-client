'use strict';

import fs from "fs";
import bencode from "bencode";
import BN from "bn.js";

import bencode from "bencode";
import crypto from "crypto";

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


