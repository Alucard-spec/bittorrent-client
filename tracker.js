'use strict';

import crypto from 'crypto';
import torrentParser from "./torrent-parser";
import util from "./util";

import dgram from 'dgram';
import {Buffer} from 'buffer';
import { URL } from 'url';

module.exports.getPeers =(torrent, callback) =>{

    const socket= dgram.createSocket('udp4');
    const url = Buffer.from(torrent.announce).toString('utf8');

    // sending connection request
    udpSend(socket,buildConnReq(),url);
    
    socket.on('message',response =>{
        if(respType(response)=== 'connect'){
            
            //recieving and parsing connection response
            
            const connResp = parseConnResp(response);
            
            
            const announceReq= buildAnnounceReq(connResp.connectionId,torrent);
            
            //sending announce request

            udpSend(socket,announceReq,url);

        }
        else if(respType(response)=== 'announce'){

            // recieving and parsing announce response 

            const announceResp= parseAnnounceResp(response);
            // parse peers to callback
            callback(announceResp.peers);
        }
    }
);
};

function udpSend(socket, message, rawUrl, callback=()=>{}){
    const url = new URL(rawUrl);
    socket.send(message,0,message.length,url.port,url.host,callback);
}
function respType(resp){

}
function buildAnnounceReq(connId,torrent,port = 6881){
    const buf = Buffer.allocUnsafe(98);

    //connection Id
    connId.copy(buf,0);

    //action
    buf.writeUInt32BE(1,8);

    // transaction Id
    crypto.randomBytes(4).copy(buf,12);

    // info hash
    torrentParser.infoHash(torrent).copy(buf,16);

    // peer Id
    util.getId().copy(buf,36);

    // downloaded
    Buffer.alloc(8).copy(buf,56);

    //left
    torrentParser.size(torrent).copy(buf,64);

    // uploaded
    Buffer.alloc(8).copy(buf,72);

    // event
    buf.writeUInt32BE(0,80);

    // ip address 
    buf.writeUInt32BE(0,84);

    // key
    crypto.randomBytes(4).copy(buf,88);

    //num want 
    buf.writeInt32BE(-1,92);

    //port
    buf.writeUInt16BE(port,96);

    return buf;




}
function buildConnReq(){
    const buf =Buffer.alloc(16);

    // Connection ID
    buf.writeUInt32BE(0x417,0);
    buf.writeUInt32BE(0x27101980,4);

    
    //Writing action (0 means connection request)
    buf.writeUInt32BE(0,8);

    // generating random bytes to represent transaction Id to uniquely identify a session
    crypto.randomBytes(4).copy(buf,12);
    return buf;

}

function parseAnnounceResp(resp){

    function group(iterable, groupSize){
        let groups= [];
        for (let i=0;i<iterable.length;i+=groupSize){
            groups.push(iterable.slice(i,i+groupSize));
        }
        return groups;
    }
    return {
        action:resp.readUInt32BE(0),
        transactionId:resp.readUInt32BE(4),
        leechers:resp.readUInt32BE(8),
        seeders:resp.readUInt32BE(12),
        peers:group(resp.slice(20),6).map(address=>{
            return {
                ip:address.slice(0,4).join('.'),
                port:address.readUInt16BE(4)
            }
        })
    }

}

function parseConnResp(resp){

    return {
        action:resp.readUInt32BE(0),
        transactionId:resp.readUInt32BE(4),
        connectionId:resp.slice(8)
    }
}