const models = require('../models/channelAnnouncement')
const utils = require('../utilities/utilities')

function channelAnnouncementParser(rawData,scid) {

    // Scid
    models.channel_announcement.scid = scid;

    // node_signature_1
    for (let hex of utils.hexFormatValues(rawData.slice(2, 66))) {
        models.channel_announcement.signature.node_signature_1 += hex
    } 

    // node_signature_2
    for (let hex of utils.hexFormatValues(rawData.slice(66, 130))) {
        models.channel_announcement.signature.node_signature_2 += hex
    } 

    // bitcoin_signature_1
    for (let hex of utils.hexFormatValues(rawData.slice(130, 194))) {
        models.channel_announcement.signature.bitcoin_signature_1 += hex
    } 

    // bitcoin_signature_2
    for (let hex of utils.hexFormatValues(rawData.slice(194, 258))) {
        models.channel_announcement.signature.bitcoin_signature_2 += hex
    } 

    // features
    for (let hex of utils.hexFormatValues(rawData.slice(258, 260))) {
        models.channel_announcement.features += hex
    }
    models.channel_announcement.features = parseInt(models.channel_announcement.features, 16)

    // chain_hash
    for (let hex of utils.hexFormatValues(rawData.slice(260, 291))) {
        models.channel_announcement.chain_hash += hex
    }

    // short_channel_id
    for (let hex of utils.hexFormatValues(rawData.slice(292, 295))) {
        models.channel_announcement.short_channel_id.block += hex
    } 
    for (let hex of utils.hexFormatValues(rawData.slice(295, 298))) {
        models.channel_announcement.short_channel_id.tx_id += hex
    }
    for (let hex of utils.hexFormatValues(rawData.slice(298, 300))) {
        models.channel_announcement.short_channel_id.output_index += hex
    }
    models.channel_announcement.short_channel_id.block = parseInt(models.channel_announcement.short_channel_id.block, 16)
    models.channel_announcement.short_channel_id.tx_id = parseInt(models.channel_announcement.short_channel_id.tx_id, 16)
    models.channel_announcement.short_channel_id.output_index = parseInt(models.channel_announcement.short_channel_id.output_index, 16)
    models.channel_announcement.short_channel_id.short_channel_id = models.channel_announcement.short_channel_id.block + "x" + models.channel_announcement.short_channel_id.tx_id + "x" + models.channel_announcement.short_channel_id.output_index

    // point
    // node_id_1
    for (let hex of utils.hexFormatValues(rawData.slice(300, 333))) {
        models.channel_announcement.point.node_id_1 += hex
    }

    // node_id_2
    for (let hex of utils.hexFormatValues(rawData.slice(333, 366))) {
        models.channel_announcement.point.node_id_2 += hex
    }

    // bitcoin_key_1
    for (let hex of utils.hexFormatValues(rawData.slice(366, 399))) {
        models.channel_announcement.point.bitcoin_key_1 += hex
    }

    // bitcoin_key_2
    for (let hex of utils.hexFormatValues(rawData.slice(399, 432))) {
        models.channel_announcement.point.bitcoin_key_2 += hex
    }

    return models.channel_announcement;
}

module.exports = {
    channelAnnouncementParser
}