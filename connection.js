// async lib
var Q = require('q');
var Rx = require('rxjs/Rx');

// hash lib
var hash = require('object-hash');
// connection lib
var Slack = require('slack-node');
var Skyweb = require('skyweb');
var slackAPI = require('slackbotapi');
var Promise = require('promise');

var Connection = function (webhookUri, token, channel, username, password, skypeRoomId) {
  // slack authentication
  this.webhookUri = webhookUri;
  this.token = token;
  this.channel = channel;
  // skype authentication
  this.username = username;
  this.password = password;
  this.skypeRoomId = skypeRoomId;
  // bot api
  this.skyweb = new Skyweb();
  const errorListener = function(eventName, error) {
    //console.log(`${errorCount} : Error occured : ${error}`);
    // errorCount++;
    // if (errorCount === 10) {
    //     console.log(`Removing error listener`);
    //     this.skyweb.un('error', errorListener); // Removing error listener
    // }
    console.log(error);
  };
  this.skyweb.on('error', errorListener); //Adding error listener

  this.slack = new Slack();
  //this.slackBot = new slackAPI();

  this.socket = hash(this);
};

Connection.prototype.connect = function() {
  console.log("Connecting to skype and slack");
  this.initSlack();
  this.initSkype();
};

Connection.prototype.initSlack = function() {
  //var deferred = Q.defer();
  this.slack.setWebhook(this.webhookUri);

  this.slackBot = new slackAPI({
  	'token': this.token,
  	'logging': true,
  	'autoReconnect': true
  });

  //deferred.resolve(callback);
  //return deferred.promise;
}

Connection.prototype.initSkype = function () {
  this.skyweb.login(this.username, this.password).then(function (skypeAccount) {
    console.log('Skype logged in as ' + this.username);
    this.listenSkype();
    this.listenSlack();
  });
}

Connection.prototype.listenSlack = function () {
  this.slackBot.on('message', function (data) {
    console.log('sending slacks msg: ' + data );
    var user = this.slackBot.getUser(data.user);
    if (user != null) {
      var text = transformSlackText(user.name, data.text);
      this.talkToSkype(text);
    } else {
      console.log("not a user");
    }
  });
}

Connection.prototype.listenSkype = function () {
  this.skyweb.messagesCallback = function (messages) {
      messages.forEach(function (message) {
      var conversationLink = message.resource.conversationLink;
      var conversationId = conversationLink.substring(conversationLink.lastIndexOf('/') + 1);
      if (skypeRoomId == conversationId) {
        if (message.resource.imdisplayname != username) {
          this.talkToSlack(transformSkypeText(message.resource.content));
        }
      }
    });
  };
}

Connection.prototype.talkToSlack = function (text) {
  this.slack.webhook({
    channel: this.channel,
    username: message.resource.imdisplayname,
    text: text
  }, function(err, response) {
    console.log(response);
  });
}

Connection.prototype.talkToSkype = function (text) {
  this.skyweb.sendMessage(this.skypeRoomId, text);
}

function transformSkypeText(text) {
  //escape tags and correct apos, quote
  return querystring.unescape(striptags(text)).replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

function transformSlackText(username, text) {
  return "<b raw='*' pre='*'>" + username + "</b>: " + querystring.unescape(text).replace(/<|>/g, '');
}

Connection.prototype.getSocket = function() {
  return this.socket;
}

module.exports = Connection;
