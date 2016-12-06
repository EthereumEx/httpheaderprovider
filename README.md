# HttpHeaderProvider - A Replacement Web3.js HttpProvider supporting custom HTTP Headers
This module can be used in place of `HttpProvider` from [web3.js](https://github.com/ethereum/web3.js/).

Once in place, the constructor offers a `headers` parameter that is a `key/value` object that has the headers to be set.

## Using

First you need to grab the `npm` package and then reference it.

```bash
npm install --save httpheaderprovider

```

### Debug Mode
The module supports emitting debug information by adding an environment variable:

```bash
export DEBUG=ethereumex:httpheaderprovider

# windows cmd
SET DEBUG=ethereumex:httpheaderprovider

# posh
$env:DEBUG="ethereumex:httpheaderprovider"

```

#### Debug messages
Once debug is enabled you see things like:

```bash

talking to remote Geth on https://<yourAPI>.azure-api.net/geth/
  ethereumex:httpheaderprovider constructor:begin +0ms
  ethereumex:httpheaderprovider constructor:end +2ms
  ethereumex:httpheaderprovider Request: {"jsonrpc":"2.0","id":1,"method":"web3_clientVersion","params":[]} +1ms
  ethereumex:httpheaderprovider prepareRequest:begin +1ms
  ethereumex:httpheaderprovider setting headers +13ms
  ethereumex:httpheaderprovider prepareRequest:end +0ms
  ethereumex:httpheaderprovider Result:  {"jsonrpc":"2.0","id":1,"result":"Geth/v1.5.4-stable-b70acf3c/linux/go1.7.3"} +371ms
ethereum client info: Geth/v1.5.4-stable-b70acf3c/linux/go1.7.3
  ethereumex:httpheaderprovider Request: {"jsonrpc":"2.0","id":2,"method":"net_peerCount","params":[]} +1ms
  ethereumex:httpheaderprovider prepareRequest:begin +0ms
  ethereumex:httpheaderprovider setting headers +1ms
  ethereumex:httpheaderprovider prepareRequest:end +0ms
  ethereumex:httpheaderprovider Result:  {"jsonrpc":"2.0","id":2,"result":"0x19"} +249ms
Peer Count: 25
  ethereumex:httpheaderprovider Request: {"jsonrpc":"2.0","id":3,"method":"eth_coinbase","params":[]} +3ms
  ethereumex:httpheaderprovider prepareRequest:begin +0ms
  ethereumex:httpheaderprovider setting headers +0ms
  ethereumex:httpheaderprovider prepareRequest:end +0ms
  ethereumex:httpheaderprovider Result:  {"jsonrpc":"2.0","id":3,"result":"0x13015840b5b4641f3ad441e36ec428d7a1c9934c"} +431ms
web3.eth.coinbase: 0x13015840b5b4641f3ad441e36ec428d7a1c9934c
  ethereumex:httpheaderprovider Request: {"jsonrpc":"2.0","id":4,"method":"eth_getBalance","params":["0x13015840b5b4641f3ad441e36ec428d7a1c9934c","latest"]} +2ms
  ethereumex:httpheaderprovider prepareRequest:begin +0ms
  ethereumex:httpheaderprovider setting headers +0ms
  ethereumex:httpheaderprovider prepareRequest:end +1ms
  ethereumex:httpheaderprovider Result:  {"jsonrpc":"2.0","id":4,"result":"0x8cf23f909c0fa000"} +277ms
web3.eth.getBalance(coinbase) 10156250000000000000

```


### Adding to your web3.js project
In your JavaScript project instead of create an instance of the `web3.providers.HttpProvider` in place, create an instance of `HttpHeaderProvider` with the same parameters along with a object that is a key/value property object.

```javascript
var Web3 = require('web3');
var web3 = new Web3();

var HttpHeaderProvider = require('httpheaderprovider');

var headers = {
  "Ocp-Apim-Subscription-Key": "mykeyfromtheapiportal",
  "header2": "foobar"
}
var provider = new HttpHeaderProvider('https://scicoria.azure-api.net', headers);

web3.setProvider(provider);

var coinbase = web3.eth.coinbase;
console.log(coinbase);

var balance = web3.eth.getBalance(coinbase);
console.log(balance.toString(10));
```

## Purpose
The [`JSON-RPC`](https://github.com/ethereum/wiki/wiki/JSON-RPC) endpoint on an [Ethereum client](https://geth.ethereum.org) provides no authentication or authorization boundary. All validation happens after the client receives the reqeust and processes it, and true validation is based upon the presence of a signed transaction or not.

With no protection at [layer 7](https://www.nginx.com/resources/glossary/layer-7-load-balancing/), this does pose a DoS risk vector. However, by putting a simple layer 7 proxy in front of Geth or whatever Ethereum client is being used that has the RPC endpoint open, that proxy could validate something simple like an API key or potentially an OAuth token.

Plus using a proxy that can add HTTPS and terminate it is nice as well. If the Get instance and the RPC client are distributed, this easily allows adding HTTPS to the transport.

### Microsoft Azure API Management
A reason to employ a Service such as [Azure API Management](https://azure.microsoft.com/en-us/services/api-management/) off-loads other resposibilities such as dealing with both Layer 3/4 and layer 7 DoS issues. 

#### Authorization
API Managment employs simple `token` or API Key approach in addition to OAuth bearer tokens that can be granted by Azure Active Directory, then added to the `Authorization : Bearer <token>` header.
#### Throttleing
API Manaement can also throttle based on various policies, as well as authorize only certiain calls to specific clients, all through a configuration oriented approach.

# Usage and Approach

For a scenario recently encountered, a goal was to utilize [Microsoft Azure API Management](https://azure.microsoft.com/en-us/services/api-management/) for this purpose, but there is a need to inject a custom header that the web3.js libraries today do not offer a way.

## Approach

This library takes advantage of subclassing and create a virtual function for `HttpProvider.prepareRequest`. The approach in the library uses pre-es2015 JavaScript. However, to make it clear what is being done, here is the es2015 compatible module:

```javascript
class HttpHeaderProvider extends Web3.providers.HttpProvider {
  constructor(host, headers) {
    debug('in prv constructor');
    super(host);
  }
...
  prepareRequest(async) {
    debug('in prepare');
    var request = super.prepareRequest(async);
    if (this.headers){
      debug('setting headers')
      for (var header in this.headers){
        request.setRequestHeader( header, this.headers[header]);
      }
    }
    return request;
  }
}
```

