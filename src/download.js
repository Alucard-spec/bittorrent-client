"use strict";

import net from "net";
import {Buffer} from "buffer";
import {getPeers} from "./tracker.js";

import {buildBitField,buildCancel,buildChoke,buildHandshake,buildHave,buildInterested,buildKeepAlive,buildPiece,buildPort,buildRequest,buildUnchoke,buildUninterested,parse} from "./message.js";

export function downloads(torrent){

  const requested=[];
    getPeers(torrent,peers=>{
        peers.forEach(peer => download(peer,torrent,requested));
    });
};
function download(peer,torrent,requested){

    const queue=[]
    const socket = net.Socket();
    socket.on('error',console.log("Error recieved"));
    socket.connect(peer.port, peer.ip,()=>{
        // 1
        socket.write(buildHandshake(torrent));
    });
    onWholeMsg(socket, msg => {
        msgHandler(msg,socket,requested,queue);   
      });    
}



// so what we are doing in the above functions is get the peers from the get peer function of tracker.js and then creatig a tcp connection with each of those peers and start exchanging messages.

function msgHandler(msg, socket,requested,queue) {
  if (isHandshake(msg)) {
    socket.write(message.buildInterested());
  } else {
    const m = message.parse(msg);

    if (m.id === 0) chokeHandler();
    if (m.id === 1) unchokeHandler();
    if (m.id === 4) haveHandler(m.payload,socket,requested,queue);
    if (m.id === 5) bitfieldHandler(m.payload);
    if (m.id === 7) pieceHandler(m.payload, socket, requested, queue);
  }
    
  }

  function isHandshake(msg) {
    return msg.length === msg.readUInt8(0) + 49 &&
           msg.toString('utf8', 1) === 'BitTorrent protocol';
  }

function onWholeMsg(socket, callback){
    let savedBuf = Buffer.alloc(0);
    let handshake = true;
  
    socket.on('data', recvBuf => {
      // msgLen calculates the length of a whole message
      const msgLen = () => handshake ? savedBuf.readUInt8(0) + 49 : savedBuf.readInt32BE(0) + 4;
      savedBuf = Buffer.concat([savedBuf, recvBuf]);
  
      while (savedBuf.length >= 4 && savedBuf.length >= msgLen()) {
        callback(savedBuf.subarray(0, msgLen()));
        savedBuf = savedBuf.subarray(msgLen());
        handshake = false;
      }
    });
}

function chokeHandler(){

}
function unchokeHandler(){

} 

function haveHandler(payload,socket ,requested,queue) {
  const pieceIndex = payload.readUInt32BE(0);
  queue.push(pieceIndex);
  if (queue.length === 1) {
    requestPiece(socket, requested, queue);
  }

  if (!requested[pieceIndex]) {
    socket.write(buildRequest());
  }
  requested[pieceIndex] = true;

  }



function bitfieldHandler(payload) { }

function pieceHandler(payload, socket, requested, queue) { }

function requestPiece(socket, requested, queue) {
  if (requested[queue[0]]) {
    queue.shift();
  } else {
    // this is pseudo-code, as buildRequest actually takes slightly more
    // complex arguments
    socket.write(buildRequest(pieceIndex));
  }
}