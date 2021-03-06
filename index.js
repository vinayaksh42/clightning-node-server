const express = require('express')
const bodyParser = require('body-parser')
const db = require('./routes/queries')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ respone: 'check' })
})

app.get('/channel_announcements', db.getChannelInfo)
app.get('/channel_updates', db.getChannelUpdate)
app.get('/node_announcements', db.nodeInfo)
app.get('/channel_list', db.getChannelList)
app.get('/node_list', db.getNodeList)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
