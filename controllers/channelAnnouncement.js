const utils = require('../utilities/utilities')


function channelAnnouncementParser(rawData,scid) {
    // schema
    const channel_announcement = {
        scid: '',
        signature: {
        node_signature_1: '',
        node_signature_2: '',
        bitcoin_signature_1: '',
        bitcoin_signature_2: ''
        },
        features: '',
        chain_hash: '',
        short_channel_id: {
        block: '',
        tx_id: '',
        output_index: '',
        short_channel_id: ''
        },
        node_id_1: '',
        node_id_2: '',
        bitcoin_key_1: '',
        bitcoin_key_2: ''
    }

    let curr_index = 0;
    curr_index += 2;// first two bytes are version
    
    // Scid
    channel_announcement.scid = scid;

    // node_signature_1
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=64))) {
        channel_announcement.signature.node_signature_1 += hex
    } 

    // node_signature_2
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=64))) {
        channel_announcement.signature.node_signature_2 += hex
    } 

    // bitcoin_signature_1
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=64))) {
        channel_announcement.signature.bitcoin_signature_1 += hex
    } 

    // bitcoin_signature_2
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=64))) {
        channel_announcement.signature.bitcoin_signature_2 += hex
    } 

    // features
    let flen = ''
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=2))) {
        flen += hex
    }
    flen = parseInt(flen, 16)
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=flen))) {
        channel_announcement.features += hex
    }
    if(channel_announcement.features === ''){
        channel_announcement.features = '0'
    }

    // chain_hash
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=32).reverse())) {
        channel_announcement.chain_hash += hex
    }

    // short_channel_id
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=3))) {
        channel_announcement.short_channel_id.block += hex
    } 
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=3))) {
        channel_announcement.short_channel_id.tx_id += hex
    }
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=2))) {
        channel_announcement.short_channel_id.output_index += hex
    }
    channel_announcement.short_channel_id.block = parseInt(channel_announcement.short_channel_id.block, 16)
    channel_announcement.short_channel_id.tx_id = parseInt(channel_announcement.short_channel_id.tx_id, 16)
    channel_announcement.short_channel_id.output_index = parseInt(channel_announcement.short_channel_id.output_index, 16)
    channel_announcement.short_channel_id.short_channel_id = channel_announcement.short_channel_id.block + "x" + channel_announcement.short_channel_id.tx_id + "x" + channel_announcement.short_channel_id.output_index

    // point
    // node_id_1
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=33))) {
        channel_announcement.node_id_1 += hex
    }

    // node_id_2
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=33))) {
        channel_announcement.node_id_2 += hex
    }

    // bitcoin_key_1
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=33))) {
        channel_announcement.bitcoin_key_1 += hex
    }

    // bitcoin_key_2
    for (let hex of utils.hexFormatValues(rawData.slice(curr_index, curr_index+=33))) {
        channel_announcement.bitcoin_key_2 += hex
    }

    return channel_announcement;
}

module.exports = {
    channelAnnouncementParser
}