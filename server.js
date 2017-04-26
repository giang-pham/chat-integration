#!/bin/env node
// web lib
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// connection lib
var io = require('socket.io')(http);
var express = require('express');
var fs = require('fs');
// word processing lib
var striptags = require('striptags');
var querystring = require('querystring');
//hash
var hash = require('object-hash');
// customized lib
var Connection = require('./connection.js');

var quoteInterval = 21600000 // 6 hrs

var app = express();

var connectionMap = {};

app.get('/connect', function(req, res) {//TODO: secure the request parameter
	// create new connection
	var connection = new Connection(
		req.query.webhookUri, req.query.token, req.query.channel,
		req.query.username, req.query.password, req.query.skypeRoomId);

	// create connection key to access later
	var connectionKey = hash(connection);

	if (connectionKey in connectionMap) { // This bridge has been connected before > pull bridge from map
		connection = connectionMap[connectionKey];
	} else { // Build a new bridge & push brige to map
		connection.connect();
		connectionMap[connectionKey] = connection;
	}

	return connection.getSocket();
});

app.get('/', function (req, res) {
  res.send('Hello World!');
	// TODO: implement
});

app.get('/restart-skype', function(req, res) {
   // TODO: implement
});
app.get('/test', function(req, res) {

  var webhookUri = "https://hooks.slack.com/services/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";
	var token = "xoxb-14980904678-O1AOxpq5lApx9qiZGv9FEYeK";
	var channel = "#chim-sieu-cuong";
	var username = "skype.bot423";

  var password = "skyp3bot";
	var skypeRoomId = "19:eb5c3d26ecce4d2d8dcec9e17c7e66eb@thread.skype";
  var connection = new Connection(
		webhookUri, token, channel,
		username, password, skypeRoomId);

	// create connection key to access later
	var connectionKey = hash(connection);

	if (connectionKey in connectionMap) { // This bridge has been connected before > pull bridge from map
		connection = connectionMap[connectionKey];
	} else { // Build a new bridge & push brige to map
		connection.connect();
		connectionMap[connectionKey] = connection;
	}
	return connection.getSocket();
});

// IP and Port follow openshift environment settings
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var server = app.listen(port, ipaddress, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Chatting app listening at http://%s:%s', host, port);
});
