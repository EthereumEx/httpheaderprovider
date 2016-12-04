#!/usr/bin/env node

"use strict";

var TestRPC = require("ethereumjs-testrpc");
var rpcPort = 8545;
var options = {
    "logger": console,
    "verbose" : true,
    //"port": 8000,
    "locked": false
}

var server = TestRPC.server(options);

server.on('connect', (req, cltSocket, head) => {
    console.log('connected'); 
});

server.listen(rpcPort, function(err, blockchain) {
    for (var addr in blockchain.accounts){
        console.log("account address: %s ", blockchain.accounts[addr].address);
    }
    console.log('now listening...')
});