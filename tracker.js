'use strict';

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
            
            
            const announceReq= buildAnnounceReq(connResp.connectionId);
            
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
function buildAnnounceReq(connId){

}
function buildConnReq(){

}

function parseAnnounceResp(resp){

}

function parseConnResp(resp){

}