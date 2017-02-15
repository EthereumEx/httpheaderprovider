#!/usr/bin/env node

var fs = require('fs');
var chalk = require('chalk');
var Web3 = require('web3');
var web3 = new Web3();


var parms = JSON.parse( fs.readFileSync(__dirname + '/../parms.json') );


/* This is the ony change - these 3 chunks */
//chunk 1
var HttpHeaderProvider = require('../lib');
//chunk 2
var headers = {
  "Ocp-Apim-Subscription-Key": parms.apikey
}

var httpProvider = new Web3.providers.HttpProvider(parms.apiurl);

//chunk 3
var newProvider = new HttpHeaderProvider(parms.apiurl, headers);

function makeCall(provider) {
  web3.setProvider(provider);
  console.log(chalk.green.underline.bold("talking to remote Geth on %s"), parms.apiurl);
  console.log(chalk.cyan.bold("ethereum client info: %s"), web3.version.node);
  console.log(chalk.yellow.bold("Peer Count: %d"), web3.net.peerCount);

  var coinbase = web3.eth.coinbase;
  console.log(chalk.cyan.bold("web3.eth.coinbase: %s"), coinbase);

  //replace the hex with a valid account addr
  var balance = web3.eth.getBalance(parms.address);

  console.log(
    chalk.yellow.bold("web3.eth.getBalance(addr)\n\t"), 
    chalk.green(balance.toString(10)), 
    chalk.blue('wei\n\t'),
    chalk.blue.bold(web3.fromWei(balance, 'ether')), 
    chalk.green('ether'));
}


// First call is via base httpprovider - this will FAIL
try {
  console.log(chalk.green.bold.underline('Call via normal provider'))
  makeCall(httpProvider);
} catch (error) {
  console.error(chalk.red.bold.underline("\tfail on httpprovider call: "))
  console.error(chalk.red.bold('\t\t%s'), error.message);
}

// second call is via custom extended httprovider - this should succeed
try {
  console.log(chalk.green.bold.underline('\n\nCall via custom provider'))
  makeCall(newProvider);
} catch (error) {
  console.error(chalk.red.bold.underline("\t\tfail on new provider call: "))
  console.error(chalk.red.bold('\t\t%s'), error.message);
}




/*
WEI	1
Ada	1000
Fentoether	1000
Kwei	1000
Mwei	1000000
Babbage	1000000
Pictoether	1000000
Shannon	1000000000
Gwei	1000000000
Nano	1000000000
Szabo	1000000000000
Micro	1000000000000
Microether	1000000000000
Finney	1000000000000000
Milli	1000000000000000
Milliether	1000000000000000
Ether	1000000000000000000
Einstein	1000000000000000000000
Kether	1000000000000000000000
Grand	1000000000000000000000
Mether	1000000000000000000000000
Gether	1000000000000000000000000000
Tether	1000000000000000000000000000000
*/