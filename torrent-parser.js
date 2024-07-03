'use strict';

import fs from "fs";
import bencode from "bencode";

module.exports.open =(filepath)=>{
    return bencode.decode(fs.readFileSync(filepath));

};
module.exports.size=torrent=>{

};

module.exports.infoHash= torrent=>{

};


