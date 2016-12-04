/* HttpHeaderProvider
https://github.com/EthereumEx/HttpHeaderProvider
Copyright (c) Microsoft Corporation. All rights reserved. 
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0  
 
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, 
MERCHANTABLITY OR NON-INFRINGEMENT. 
 
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
*/

'use strict';

var debug = require('debug')('ethereumex:httpheaderprovider');

var Web3 = require('web3');
var headers;

var httpheaderprovider = function (host, headers) {
    debug('constructor:begin')
    this.headers = headers;
    Web3.providers.HttpProvider.call(this, host);
    debug('constructor:end')
}

httpheaderprovider.prototype = new Web3.providers.HttpProvider();

httpheaderprovider.prototype.prepareRequest = function _prepare (async) {
    debug('prepareRequest:begin');
    var request = Web3.providers.HttpProvider.prototype.prepareRequest.call(this, async);

    if (this.headers){
      debug('setting headers')
      for (var header in this.headers){
        request.setRequestHeader( header, this.headers[header]);
      }
    }
    debug('prepareRequest:end');
    return request;
}


//the 'classy way' in es2015+

/*

class headerprovider extends Web3.providers.HttpProvider {
  constructor(host) {
    debug('in prv constructor');
    super(host);
  }

  prepareRequest(async) {
    debug('in prepare');
    var request = super.prepareRequest(async);

    return request;
  }
}

*/

module.exports = httpheaderprovider;



