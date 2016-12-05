# HttpHeaderProvider - A Replacement Web3.js HttpProvider supporting custom HTTP Headers
This module can be used in place of `HttpProvider` from web3.

Once in place, the constructor offers a `headers` parameter that is a `key/value` object that has the headers to be set.

## Purpose
The [`JSON-RPC`](https://github.com/ethereum/wiki/wiki/JSON-RPC) endpoint on an [Ethereum client](https://geth.ethereum.org) provide no authentication boundary. All validation is based upon the presence of a signed transaction or not.

With no protection at [layer 7](https://www.nginx.com/resources/glossary/layer-7-load-balancing/), this does pose a DoS risk vector. However, by putting a simple layer 7 proxy in front of Geth or whatever Ethereum client is being used that has the RPC endpoint open, that proxy could validate something simple like an API key or potentially an OAuth token.

### Microsoft Azure API Management
A reason to employ a Service such as [Azure API Management](https://azure.microsoft.com/en-us/services/api-management/) off-loads other resposibilities such as dealing with both Layer 3/4 and layer 7 DoS issues. 

#### Authorization
API Managment employs simple "token" or API Key approach in addition to OAuth bearer tokens that can be granted by Azure Active Directory, then added to the `Authorization : Bearer &lt;token&gt;` header.
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

## Using

First you need to grab the `npm` package and then reference it.

```bash
npm install --save httpheaderprovider

```

In your JavaScript project instead of create an instance of the `web3.providers.HttpProvider` in place, create an instance of `headerprovider` with the same parameters along with a object that is a key/value property object.

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