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
1. For checking if the server is active
```js
/
```

2. For fetching channel_announcement
```js
/channel_announcements
```

3. For fetching channel_updates
```js
/channel_updates
```

4. For fetching node_announcements
```js
/node_announcements
```


## Blog
https://vinayaksh42.medium.com/parsing-raw-gossip-messages-using-node-js-c71e90f256c9
