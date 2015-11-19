var Slack = require('slack-node');
var Skyweb = require('skyweb');
var fs = require('fs');
var striptags = require('striptags');

var webhookUri = xxx;
var token = xxx;
var skypeRoomId = xxx;

slack = new Slack();
slack.setWebhook(webhookUri);

var slackAPI = require('slackbotapi');

// Starting
var bot = new slackAPI({
    'token': token,
    'logging': true,
    'autoReconnect': true
});

var skyweb = new Skyweb();
var username = xxx;
var password = xxx;

bot.on('message', function (data) {
    //console.log("=========================");
    //console.log(data);
    //console.log("=========================");
    //if (data.user != "duytiep@live.com") {
        var user = bot.getUser(data.user);
        if (user != null) {
            var username = "[" + user.name + "] : ";
            skyweb.sendMessage(skypeRoomId, username + data.text);
        } else {
            console.log("not a user");
        }
    //}
});




skyweb.login(username, password).then(function (skypeAccount) {
    console.log("Skyweb is initialized");
});

skyweb.messagesCallback = function (messages) {
    messages.forEach(function (message) {
        //if (message.resource.from.indexOf(username) === -1 && message.resource.messagetype !== 'Control/Typing' && message.resource.messagetype !== 'Control/ClearTyping') {
        //    var conversationLink = message.resource.conversationLink;
        //    var conversationId = conversationLink.substring(conversationLink.lastIndexOf('/') + 1);
        //    skyweb.sendMessage(conversationId, message.resource.content + '. Cats will rule the World');
        //}
        var conversationLink = message.resource.conversationLink;
        var conversationId = conversationLink.substring(conversationLink.lastIndexOf('/') + 1);
        //console.log(conversationId);
        if (skypeRoomId == conversationId) {
            //console.log((message.resource.imdisplayname));
            if (message.resource.imdisplayname != "skype.bot423") {
                slack.webhook({
                    channel: "#chim-sieu-cuong",
                    username: message.resource.imdisplayname,
                    text: striptags(message.resource.content),
                }, function(err, response) {
                    console.log(response);
                });
            }

        }
    });
};

