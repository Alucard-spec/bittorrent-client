'use strict';

import fs from 'fs';
import bencode from 'bencode';
import tracker from './tracker';
import torrentParser from "./torrent-parser";

// const torrent = bencode.decode(fs.readFileSync('puppy.torrent'));
const torrent = torrentParser.open('puppy.torrent');

tracker.getPeers(torrent,peers=>{
    console.log('List of peers ',peers);
});



