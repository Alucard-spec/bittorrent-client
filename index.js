'use strict';

import fs from 'fs';
import bencode from 'bencode';

import dgram from 'dgram';
import buffer from 'buffer';
import {URL} from 'url';

const torrent = bencode.decode(fs.readFileSync('puppy.torrent'));


const annouceUrl = Buffer.from(torrent.announce).toString('utf8');

const url_link = new URL(annouceUrl);

const socket = dgram.createSocket('udp4');
const myMsg= buffer.Buffer.from('hello?','utf8');
socket.send(myMsg,0,myMsg.length,url_link.port,url_link.host,()=>{});
socket.on('message',msg=>{
    console.log('message is ',msg);
});



