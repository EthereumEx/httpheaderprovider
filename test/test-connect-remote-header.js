#!/usr/bin/env node

var Web3 = require('web3');
var web3 = new Web3();

var HttpHeaderProvider = require('../lib');

var headers = {
  "Ocp-Apim-Subscription-Key": "<apikeyhere>"
}

var url = "https://scicoria.azure-api.net/geth/";

console.log("talking to remote Geth on %s", url)
var provider = new HttpHeaderProvider(url, headers);

web3.setProvider(provider);


console.log("ethereum client info: %s", web3.version.node);
console.log("Peer Count: %d", web3.net.peerCount);

var coinbase = web3.eth.coinbase;
console.log("web3.eth.coinbase: %s", coinbase);

//replace the hex with a valid account addr
var balance = web3.eth.getBalance('13015840b5b4641f3ad441e36ec428d7a1c9934c');
console.log("web3.eth.getBalance(addr)", balance.toString(10));

