const express = require('express')
const bodyParser = require('body-parser')
const db = require('./routes/queries')
const app = express()
const port = 3000
const CronJob = require('cron').CronJob;
const Jobs = require('./functions/index')

var job = new CronJob(
	'47 * * * *',
	function() {
		Jobs.createChannelProfile()
    	Jobs.updateChannelProfile()
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

app.get('/channel_announcements', db.getChannelInfo)
app.get('/channel_updates', db.getChannelUpdate)
app.get('/node_announcements', db.nodeInfo)
app.get('/channel_list', db.getChannelList)
app.get('/node_list', db.getNodeList)

job.start();

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
