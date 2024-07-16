"use strict";

import net from "net";
import {Buffer} from "buffer";
import {getPeers} from "./tracker.js"
export function downloads(torrent){
    getPeers(torrent,peers=>{
        peers.forEach(download);
    });
};
function download(peer){
    const socket = net.Socket();
    socket.on('error',console.log("Error recieved"));
    socket.connect(peer.port, peer.ip,()=>{
        //Write the message here
    });
    socket.on('data',data=>{
        //handle the response here
    });
}

// so what we are doing in the above functions is get the peers from the get peer function of tracker.js and then creatig a tcp connection with each of those peers and start exchanging messages.
