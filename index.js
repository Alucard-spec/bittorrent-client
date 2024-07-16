'use strict';

import fs from 'fs';
import bencode from 'bencode';
import {getPeers} from './src/tracker.js';
import {open} from "./src/torrent-parser.js";

// const torrent = bencode.decode(fs.readFileSync('puppy.torrent'));
const torrent = open('testing.torrent');

getPeers(torrent,peers=>{
    console.log('List of peers ',peers);
});



