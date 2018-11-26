require('dotenv').config();
var should = require('should');

describe('Algolia Analytics', function () {
  var Analytics = require('../src/algoliaanalytics-node');
  it('should found environment variables', function(done) {
    should.exist(process.env.ALGOLIA_APPLICATION_ID);
    should.exist(process.env.ALGOLIA_API_KEY);
    should.exist(process.env.ALGOLIA_INDEX);
    done();
  });

  var client = new Analytics(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY);

  it('should be able to get popular searches', function (done) {
    client.popularSearches(process.env.ALGOLIA_INDEX, {size: 100}, function(success, body) {
      if (success === false) {
        console.log(body);
      }
      success.should.eql(true);
      should.exist(body.searches);
      done();
    });
  });

  it('should be able to get no results searches', function (done) {
    client.searchesWithoutResults(process.env.ALGOLIA_INDEX, {size: 100}, function(success, body) {
      if (success === false) {
        console.log(body);
      }
      success.should.eql(true);
      should.exist(body.searches);
      done();
    });
  });

});
