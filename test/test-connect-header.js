#!/usr/bin/env node

var Web3 = require('web3');
var web3 = new Web3();

var headerprovider = require('../lib');

var headers = {
  "header1": "valueOf1",
  "header2": "valueOf2"
}
var provider = new headerprovider('http://localhost:8545', headers);

web3.setProvider(provider);

var coinbase = web3.eth.coinbase;
console.log(coinbase);

var balance = web3.eth.getBalance(coinbase);
console.log(balance.toString(10));


