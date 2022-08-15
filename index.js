const express = require('express')
const bodyParser = require('body-parser')
const db = require('./routes/queries')
const app = express()
var pg = require('pg');
const serverPort = 3000
const CronJob = require('cron').CronJob;
const Channel = require('./functions/channelProfile');
const Node = require('./functions/nodeProfile');
const config = require('./config/default.json');

// PostgreSQL connection
const port = config.server.port;
const host = config.server.host;
const username = config.server.username;
const password = config.server.password;
const dbName = config.server.dbName;
var conString = `${username}://${username}:${password}@${host}:${port}/${dbName}`;
var client = new pg.Client(conString);
client.connect();

// Cron Job for updating channel profile
var channelProfileJob = new CronJob(
	'0 * * * *',
	function() {
		Channel.createChannelProfile()
	},
	null,
	true,
	'America/Los_Angeles'
);

channelProfileJob.start()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// Test queries
app.get('/channel_list', db.getChannelInfo);
app.get('/channel_updates', db.getChannelUpdate);
app.get('/node_list', db.nodeInfo);

// Required queries
app.get('/channel_profile/:scid', db.getChannelProfile);
app.get('/channel_updates/:scid', db.getChannelUpdates);
app.get('/node_profile/:nodeid', db.fetchNodeProfile);

app.listen(serverPort, () => {
    console.log(`App running on port ${serverPort}.`);
})
