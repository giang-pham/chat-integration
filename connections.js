// async lib
var Q = require('q');

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
  this.slack = new Slack();
  this.slackBot = new slackAPI();

  this.socket = hash(this);
};

Connection.prototype.connect = function() {
  console.log("Connecting to skype and slack");
  initSlack()
  .then(funtion() {
    initSkype();
  });
};

function initSlack(callback) {
  var deferred = Q.defer();
  this.slack.setWebhook(this.webhookUri);

  this.slackBot = new slackAPI({
  	'token': this.token
  	'logging': true,
  	'autoReconnect': true
  });

  deferred.promise.nodeify(callback);
  return deferred.promise;
}

function initSkype () {
  skyweb.login(this.username, this.password).then(function (skypeAccount) {
    listenSkype();
    listenSlack();
  });
}

function listenSlack() {
  this.slackBot.on('message', function (data) {
    var user = bot.getUser(data.user);
    if (user != null) {
      var text = transformSlackText(user.name, data.text);
      talkToSkype(text);
    } else {
      console.log("not a user");
    }
  });
}

function listenSkype() {
  skyweb.messagesCallback = function (messages) {
      messages.forEach(function (message) {
      var conversationLink = message.resource.conversationLink;
      var conversationId = conversationLink.substring(conversationLink.lastIndexOf('/') + 1);
      if (skypeRoomId == conversationId) {
        if (message.resource.imdisplayname != username) {
          talkToSlack(transformSkypeText(message.resource.content));
        }
      }
    });
  };
}

function talkToSlack(text) {
  this.slack.webhook({
    channel: this.channel,
    username: message.resource.imdisplayname,
    text: text
  }, function(err, response) {
    console.log(response);
  });
}

function talkToSkype(text) {
  this.skyweb.sendMessage(skypeRoomId, text);
}

function transformSkypeText(text) {
  //escape tags and correct apos, quote
  return querystring.unescape(striptags(text)).replace(/&quot;/g, '"').replace(/&apos;/g, "'"),
}

function transformSlackText(username, text) {
  return "<b raw='*' pre='*'>" + username + "</b>: " + querystring.unescape(text).replace(/<|>/g, '');
}

Connection.prototype.getSocket = function() {
  return this.socket;
}

module.exports = Connection;
