const utils = require('../utilities/utilities')


function nodeAnnouncementParser(rawData,node_id) {
    // schema
    const node_announcement = {
        node_id: '',
        signature: '',
        features: '',
        timestamp: '',
        parsed_node_id: '',
        rgb_color: '',
        alias: '',
        abytes: '',
        addresses: []
    }

    let curr_index = 0;
    curr_index += 2;// first two bytes are version
    
    // node_id
    for (let hex of utils.hexFormatValues(node_id.slice(0, 33))) {
        node_announcement.node_id += hex
    }

    // signature
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=64))) {
        node_announcement.signature += hex
    }

    // features
    let flen = ''
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=2))) {
        flen += hex
    }
    flen = parseInt(flen, 16)
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=flen))) {
        node_announcement.features += hex
    }
    if(node_announcement.features === ''){
        node_announcement.features = '0'
    }

    // timestamp
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=4))) {
        node_announcement.timestamp += hex
    }
    node_announcement.timestamp = parseInt(node_announcement.timestamp, 16)


    // parsed_node_id
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=33))) {
        node_announcement.parsed_node_id += hex
    } 

    // rgb_color
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=3))) {
        node_announcement.rgb_color += hex
    } 

    // alias
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=32))) {
        node_announcement.alias += hex
    } 

    // abytes
    let alen = ''
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=2))) {
        alen += hex
    }
    alen = parseInt(alen, 16)
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=alen))) {
        node_announcement.abytes += hex
    }

    // addresses

    return node_announcement;
}

module.exports = {
    nodeAnnouncementParser
}