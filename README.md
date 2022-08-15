# clightning-node-server

## Instructions to setup

```shell
npm install
```

```shell
cp config/example.default.json config/default.json
```

change the content inside `default.json` with information related to your database deployment

```shell
npm run start
```

## Endpoints
1. provides a list of the latest channels in "channel_announcement" table (mainly used for displaying channels on LN explorer tab)
```js
/Channel_list
```

2. provides a list of the latest nodes in "node_announcement" table (mainly used for displaying channels on LN explorer tab)
```js
/node_list
```

3. provides the channel profile for a particular channel. the channel profile includes the following info about a channel:

{"scid":"812404952712347648","amount_sat":4567,"closing_height":["748412"],"block":"738878","tx_id":"3120","output_index":"0","node_id_1":"023fca3d779d3def8e99cfae86fb37b10b04c2f63324fe45aeece536eadce10947","node_id_2":"038fe1bd966b5cb0545963490c631eaa1924e2c4c0ea4e7dcb5d4582a1e7f2f1a5","txid":"02a76081cde11bf7209c2ee056f3eccb718cedab1c1a8c387575fbf18c0bf94c","closing":["760f1ffca8dc5cc065b5ec5a2207160eb46ea4b643c95072fefafae48983d3d7"]}
- short channel id
- amount_sat
- block
- transaction id
- output index
- full transaction id (funding)
- closing transaction
- closing block height
- node id 1
- node id 2
```js
/channel_profile/:scid
```

4. provides the channels updates for queried short channel id.
```js
/channel_updates/:scid
```

5. provides the node profile for a particular node. The node profile includes the following info about a node:

{"node_id":"038fe1bd966b5cb0545963490c631eaa1924e2c4c0ea4e7dcb5d4582a1e7f2f1a5","scid":["812404952712347648","812404952711430145","812404952713134081","812412649192030209","812412649192095745","812412649161293825","812411549713694721"],"rgb_color":"1c262f"}
- node id
- short channel id for all the connected channels
- rgb color
```js
/node_profile/:nodeid
```

## Cron Job
runs every hour for updating info about channel_profile, can be modified accordingly.


## Blog
https://vinayaksh42.medium.com/parsing-raw-gossip-messages-using-node-js-c71e90f256c9
