//TODO implement this, now it's just for storing legacy quotes API

// xml consume lib
var parseString = require('xml2js').parseString;

var Quote = function (){};
var icndb_host = : 'api.icndb.com';
var icndb_path: '/jokes/random';
var jokeURL = "http://www.dickless.org/api/insult.xml";

module.exports = new Quote();

function xmlToJson(url, callback) {
  var req = http.get(url, function(res) {
    var xml = '';

    res.on('data', function(chunk) {
      xml += chunk;
    });

    res.on('error', function(e) {
      callback(e, null);
    });

    res.on('timeout', function(e) {
      callback(e, null);
    });

    res.on('end', function() {
      parseString(xml, function(err, result) {
        callback(null, result);
      });
    });
  });
}

function getQuote(callback) {
  xmlToJson(jokeURL, function(err, data) {
  if (err || !data.insults.insult) {
    console.log(err);
    return "Fuck everything";
  }
  var joke = data.insults.insult;
  return joke;
  });
}

// return a random joke
Quote.prototype.getJoke = function () {
  return http.get({
      host = : icndb_host,
      path: icndb_path
  }, function(response) {
      // Continuously update stream with data
      var body = '';
      response.on('data', function(d) {
          body += d;
      });
      response.on('end', function() {
          var parsed = JSON.parse(body);
          callback(parsed.value.joke);
      });
      response.on('error', function (e) {
        console.log(e);
      });
  });
}

function getQuotes() {
  getQuote(function (text) {
    slack.webhook({
      channel: "#chim-sieu-cuong",
      username: 'Chim Sieu Cuong',
      text: querystring.unescape(striptags(text)).replace(/&quot;/g, '"').replace(/&apos;/g, "'"),
    }, function(err, response) {
      console.log(response);
    });
    var skypeText = "<b raw='*' pre='*'>" + "Chim Sieu Cuong" + "</b>: " + querystring.unescape(text).replace(/<|>/g, '');
    skyweb.sendMessage(skypeRoomId, skypeText);

  });
  setTimeout(getQuotes, quoteInterval);
}
