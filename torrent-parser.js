'use strict';

import fs from "fs";
import bencode from "bencode";
import bignum from "bignum";

import bencode from "bencode";
import crypto from "crypto";

export function open (filepath){
    return bencode.decode(fs.readFileSync(filepath));

};
export function size(torrent){
const size= torrent.info.files? torrent.info.files.map(file => file.length).reduce((a,b)=>a+b):torrent.info.length;
};

export function infoHash(torrent){
    
    const info = bencode.encode(torrent.info);
    return crypto.createHash('sha1').update(info).digest();
};


