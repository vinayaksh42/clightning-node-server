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
        point: {
        node_id_1: '',
        node_id_2: '',
        bitcoin_key_1: '',
        bitcoin_key_2: ''
        }
    }

    // Scid
    channel_announcement.scid = scid;

    // node_signature_1
    for (let hex of utils.hexFormatValues(rawData.slice(2, 66))) {
        channel_announcement.signature.node_signature_1 += hex
    } 

    // node_signature_2
    for (let hex of utils.hexFormatValues(rawData.slice(66, 130))) {
        channel_announcement.signature.node_signature_2 += hex
    } 

    // bitcoin_signature_1
    for (let hex of utils.hexFormatValues(rawData.slice(130, 194))) {
        channel_announcement.signature.bitcoin_signature_1 += hex
    } 

    // bitcoin_signature_2
    for (let hex of utils.hexFormatValues(rawData.slice(194, 258))) {
        channel_announcement.signature.bitcoin_signature_2 += hex
    } 

    // features
    for (let hex of utils.hexFormatValues(rawData.slice(258, 260))) {
        channel_announcement.features += hex
    }
    channel_announcement.features = parseInt(channel_announcement.features, 16)

    // chain_hash
    for (let hex of utils.hexFormatValues(rawData.slice(260, 291))) {
        channel_announcement.chain_hash += hex
    }

    // short_channel_id
    for (let hex of utils.hexFormatValues(rawData.slice(292, 295))) {
        channel_announcement.short_channel_id.block += hex
    } 
    for (let hex of utils.hexFormatValues(rawData.slice(295, 298))) {
        channel_announcement.short_channel_id.tx_id += hex
    }
    for (let hex of utils.hexFormatValues(rawData.slice(298, 300))) {
        channel_announcement.short_channel_id.output_index += hex
    }
    channel_announcement.short_channel_id.block = parseInt(channel_announcement.short_channel_id.block, 16)
    channel_announcement.short_channel_id.tx_id = parseInt(channel_announcement.short_channel_id.tx_id, 16)
    channel_announcement.short_channel_id.output_index = parseInt(channel_announcement.short_channel_id.output_index, 16)
    channel_announcement.short_channel_id.short_channel_id = channel_announcement.short_channel_id.block + "x" + channel_announcement.short_channel_id.tx_id + "x" + channel_announcement.short_channel_id.output_index

    // point
    // node_id_1
    for (let hex of utils.hexFormatValues(rawData.slice(300, 333))) {
        channel_announcement.point.node_id_1 += hex
    }

    // node_id_2
    for (let hex of utils.hexFormatValues(rawData.slice(333, 366))) {
        channel_announcement.point.node_id_2 += hex
    }

    // bitcoin_key_1
    for (let hex of utils.hexFormatValues(rawData.slice(366, 399))) {
        channel_announcement.point.bitcoin_key_1 += hex
    }

    // bitcoin_key_2
    for (let hex of utils.hexFormatValues(rawData.slice(399, 432))) {
        channel_announcement.point.bitcoin_key_2 += hex
    }

    return channel_announcement;
}

module.exports = {
    channelAnnouncementParser
}