#!/usr/bin/env node

var Web3 = require('web3');
var web3 = new Web3();

var headerprovider = require('../lib');
var provider = new headerprovider('http://localhost:8545');

web3.setProvider(provider);

var coinbase = web3.eth.coinbase;
console.log(coinbase);

var balance = web3.eth.getBalance(coinbase);
console.log(balance.toString(10));

