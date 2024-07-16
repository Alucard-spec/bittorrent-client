"use strict";

import net from "net";
import {Buffer} from "buffer";
import {getPeers} from "./tracker.js";

import Pieces from "./Pieces.js";

import {buildBitField,buildCancel,buildChoke,buildHandshake,buildHave,buildInterested,buildKeepAlive,buildPiece,buildPort,buildRequest,buildUnchoke,buildUninterested,parse} from "./message.js";

export function downloads(torrent){

  
    getPeers(torrent,peers=>{
        const pieces= new Pieces(torrent.info.pieces.length/20);
        peers.forEach(peer => download(peer,torrent,requested,pieces));
    });
};
function download(peer,torrent,pieces){

    
    const socket = net.Socket();
    socket.on('error',console.log("Error recieved"));
    socket.connect(peer.port, peer.ip,()=>{
        
        socket.write(buildHandshake(torrent));
    });
    const queue={ choked: true , queue:[]};
    onWholeMsg(socket, msg => {
        msgHandler(msg,socket,pieces,queue);   
      });    
}



// so what we are doing in the above functions is get the peers from the get peer function of tracker.js and then creatig a tcp connection with each of those peers and start exchanging messages.

function msgHandler(msg, socket,pieces,queue) {
  if (isHandshake(msg)) {
    socket.write(buildInterested());
  } else {
    const m = parse(msg);

    if (m.id === 0) chokeHandler(socket);
    if (m.id === 1) unchokeHandler(socket, pieces, queue);
    if (m.id === 4) haveHandler(m.payload,socket,pieces,queue);
    if (m.id === 5) bitfieldHandler(m.payload);
    if (m.id === 7) pieceHandler(m.payload, socket, pieces, queue);
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

function chokeHandler(socket){
  socket.end();

}
function unchokeHandler(socket, pieces, queue){
  queue.choked=false;
  requestPiece(socket,pieces,queue);

} 

function haveHandler(payload,socket ,pieces,queue) {
  const pieceIndex = payload.readUInt32BE(0);
  const queueEmpty = queue.length === 0;
  queue.queue(pieceIndex);
  if (queueEmpty) requestPiece(socket, pieces, queue);

  }



function bitfieldHandler(payload) { }

function pieceHandler(payload, socket, pieces, queue) { }

function requestPiece(socket, pieces, queue) {
 
  if (queue.choked) return null;

  while (queue.queue.length) {
    const pieceIndex = queue.shift();
    if (pieces.needed(pieceIndex)) {
      // 
      socket.write(buildRequest(pieceIndex));
      pieces.addRequested(pieceIndex);
      break;
    }
  }
}