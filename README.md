# A Replacement Web3.js HttpProvider supporting Adding HTTP Headers
This module can be used in place of HttpProvider from web3.

Once in place, the constructor offers a `headers` parameter that is a `key/value` object that has the headers to be set.


## Using

First you need to grab the package:

```
npm install --save httpheaderhrovider
```

In your JavaScript project

```javascript
var Web3 = require('web3');
var web3 = new Web3();

var headerprovider = require('httpheaderprovider');

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
```