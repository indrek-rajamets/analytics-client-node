var Algolia = require('algolia-search');
var Buffers = require('buffers');
var https = require('https');

var AlgoliaAnalytics = function(applicationID, apiKey) {
  this.applicationID = applicationID;
  this.apiKey = apiKey;
  this.host = "analytics.algolia.com";
};


/**
 * Version Beta
 */
AlgoliaAnalytics.version = '0.0.1';

AlgoliaAnalytics.prototype = {

    /*
     * Test if the server is alive
     */
    isAlive: function(callback) {
      this._request({
          method: 'GET',
          hostname: this.host,
          port: 443,
          path: '/2/status'
        }, callback);
    },

    /*
     * Get popular searches
     * @param index
     * @param contains optionnal parameters (size, startAt, endAt, tags, country)
     */
    popularSearches: function(index, params, callback) {
      this._request({
          method: 'GET',
          hostname: this.host,
          port: 443,
          path: '/2/searches?index=' + encodeURIComponent(index) + (Object.keys(params).length > 0 ? ('&' + this._objectToURLParam(params)) : "")
        }, callback);
    },

    /*
     * Get searches with 0 results
     * @param index
     * @param contains optionnal parameters (size, startAt, endAt, tags)
     */
    searchesWithoutResults: function(index, params, callback) {
      this._request({
          method: 'GET',
          hostname: this.host,
          port: 443,
          path: '/2/searches/noResults?index=' + encodeURIComponent(index) + (Object.keys(params).length > 0 ? ('&' + this._objectToURLParam(params)) : "")
        }, callback);
    },

    /*
     * Get analytics used by dashboard
     */
    dashboard: function(index, params, callback) {
       this._request({
          method: 'GET',
          hostname: this.host,
          port: 443,
          path: '/2/dashboard?index=' + encodeURIComponent(index) + (Object.keys(params).length > 0 ? ('&' + this._objectToURLParam(params)) : "")
        }, callback);

    },

    /*
     * Compute request
     */
    _computeRequest: function(opts) {
      opts.headers = {}
      opts.headers['X-Algolia-API-Key'] = this.apiKey;
      opts.headers['X-Algolia-Application-Id'] = this.applicationID;
      opts.headers['User-Agent'] = 'Algolia analytics for node.js ' + AlgoliaAnalytics.version
    },

    /*
     * Convert object to URL parameter
     */
    _objectToURLParam: function(param) {
      var strParams = [];
      for(var p in param) {
        if (param.hasOwnProperty(p)) {
          strParams.push(encodeURIComponent(p) + "=" + encodeURIComponent(param[p]));
        }
      }
      return strParams.join("&");
    },

    /*
     * Get the answer
     */
    _getAnswer: function(callback, res) {
      if (res.statusCode != 200) {
        callback(false, "status code: " + res.statusCode);
        return;
      }
      var chunks = new Buffers()

      res.on('data', function(chunk) {
        chunks.push(chunk);
      });

      res.once('end', function() {
        var body = chunks.toString('utf8');
        var body = JSON.parse(body);
        res.removeAllListeners();
        callback(true, body);
      });
    },

    /*
     * Execute the request
     */
    _request: function(opt, callback) {
      this._computeRequest(opt);
      var self = this;
      var req = https.request(opt, function(res) {
        self._getAnswer(callback, res);
        });

      req.once('error', function(e) {
        callback(false, e);
      });

      req.end();
    }

};

module.exports = AlgoliaAnalytics
