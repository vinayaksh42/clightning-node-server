const express = require('express')
const bodyParser = require('body-parser')
const db = require('./routes/queries')
const app = express()
const port = 3000
const CronJob = require('cron').CronJob;
const Channel = require('./functions/channelProfile');
const Node = require('./functions/nodeProfile');

// Cron Job for updating channel profile
var job = new CronJob(
	'0 * * * *',
	function() {
		Channel.createChannelProfile()
		Node.createNodeProfile()
	},
	null,
	true,
	'America/Los_Angeles'
);

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/channel_announcements', db.getChannelInfo);
// app.get('/channel_updates', db.getChannelUpdate);
app.get('/node_announcements', db.nodeInfo);
app.get('/channel_profile/:scid', db.getChannelProfile);
app.get('/channel_updates/:scid', db.getChannelUpdates)

job.start();

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
})

Node.createNodeProfile()