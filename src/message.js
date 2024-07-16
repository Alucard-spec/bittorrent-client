'use strict';

import {Buffer} from "buffer";
import {infoHash,size,open} from './torrent-parser.js';
import {genId} from './util.js'

export function buildHandshake(torrent){
    const buf= Buffer.alloc(68);
    //pstrlen
    buf.writeUInt8(19,0);
    //pstr
    buf.write('BitTorrent Protocol',1);
    //reserved
    buf.writeUInt32BE(0,20);
    buf.writeUInt32BE(0,24);
    //info hash
    infoHash(torrent).copy(buf,28);
    //peer id
    buf.write(genId());
    return buf;

};

export function buildKeepAlive(){
   return Buffer.alloc(4);
};
export function buildChoke(){
    const buf = Buffer.alloc(5);
    //length
    buf.writeUInt32BE(1,0);

    //id
    buf.writeUInt8(0,4);
    return buf;

};

export function buildUnchoke(){
    const buf= Buffer.alloc(5);
    //length
    buf.writeUint32BE(1,0);

    //id
    buf.writeUInt8(2,4);
    return buf;
}

export function buildInterested(){
    const buf= Buffer.alloc(5);
    //length
    buf.writeUInt32BE(1,0);
    //id
    buf.writeUInt8(2,4);
};

export function buildUninterested(){
    const buf= Buffer.alloc(5);
    //length
    buf.writeUInt32BE(1,0);
    //id
    buf.writeUInt8(3,4);
    return buf;
};

export function buildHave(payload){
    const buf=Buffer.alloc(9);
    //length
    buf.writeUInt32BE(5,0);
    //id
    buf.writeUInt8(4,4);
    // piece index
    buf.writeUInt32BE(payload,5);
    return buf;
};

export function buildBitField(bitfield,payload){
    const buf=Buffer.alloc(14);

    //length
    buf.writeUInt32BE(payload.length+1,0);

    //id
    buf.writeUInt8(5,4);
    //bitfield
    bitfield.copy(buf,5);
    return buf;

};

export function buildRequest(payload){
    const buf= Buffer.alloc(17);
    //length
    buf.writeUInt32BE(13,0);
    //id
    buf.writeUInt8(6,4);
    //piece index
    buf.writeUInt32BE(payload.index,5);
    //begin
    buf.writeUInt32BE(payload.begin,9);
    //Length
    buf.writeUInt32BE(payload.length,13);
    return buf;

};

export function buildPiece(payload){
    const buf = Buffer.alloc(payload.block.length + 13);
  // length
  buf.writeUInt32BE(payload.block.length + 9, 0);
  // id
  buf.writeUInt8(7, 4);
  // piece index
  buf.writeUInt32BE(payload.index, 5);
  // begin
  buf.writeUInt32BE(payload.begin, 9);
  // block
  payload.block.copy(buf, 13);
  return buf;
};

export function buildCancel(payload){
    const buf = Buffer.alloc(17);
    // length
    buf.writeUInt32BE(13, 0);
    // id
    buf.writeUInt8(8, 4);
    // piece index
    buf.writeUInt32BE(payload.index, 5);
    // begin
    buf.writeUInt32BE(payload.begin, 9);
    // length
    buf.writeUInt32BE(payload.length, 13);
    return buf;
};

export function buildPort(payload){
    const buf = Buffer.alloc(7);
    // length
    buf.writeUInt32BE(3, 0);
    // id
    buf.writeUInt8(9, 4);
    // listen-port
    buf.writeUInt16BE(payload, 5);
    return buf;
  };