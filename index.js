'use strict';


import {getPeers} from './src/tracker.js';
import {open} from "./src/torrent-parser.js";
import {downloads} from "./src/download.js";

// const torrent = bencode.decode(fs.readFileSync('puppy.torrent'));
const torrent = open('testing.torrent');

getPeers(torrent,peers=>{
    console.log('List of peers ',peers);
});
downloads(torrent,torrent.info.name);



