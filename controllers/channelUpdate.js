const models = require('../models/channelUpdate')
const utils = require('../utilities/utilities')

function channelUpdateParser(rawData,scid,direction,timestamp) {

    // Scid
    models.channel_update.scid = scid;

    // direction
    models.channel_update.direction = direction;

    // timestamp
    models.channel_update.timestamp = String(timestamp);

    // signature
    for (let hex of utils.hexFormatValues(rawData.slice(2, 66))) {
        models.channel_update.signature += hex
    } 

    // chain_hash
    for (let hex of utils.hexFormatValues(rawData.slice(66, 98))) {
        models.channel_update.chain_hash += hex
    }

    // short_channel_id
    for (let hex of utils.hexFormatValues(rawData.slice(98, 102))) {
        models.channel_update.short_channel_id.block += hex
    } 
    for (let hex of utils.hexFormatValues(rawData.slice(102, 106))) {
        models.channel_update.short_channel_id.tx_id += hex
    }
    for (let hex of utils.hexFormatValues(rawData.slice(106, 108))) {
        models.channel_update.short_channel_id.output_index += hex
    }
    models.channel_update.short_channel_id.block = parseInt(models.channel_update.short_channel_id.block, 16)
    models.channel_update.short_channel_id.tx_id = parseInt(models.channel_update.short_channel_id.tx_id, 16)
    models.channel_update.short_channel_id.output_index = parseInt(models.channel_update.short_channel_id.output_index, 16)
    models.channel_update.short_channel_id.short_channel_id = models.channel_update.short_channel_id.block + "x" + models.channel_update.short_channel_id.tx_id + "x" + models.channel_update.short_channel_id.output_index

    // timeStamp
    for (let hex of utils.hexFormatValues(rawData.slice(108, 112))) {
        models.channel_update.timestamp += hex
    } 
    models.channel_update.timestamp = parseInt(models.channel_update.timestamp, 16)

    // message_flags
    for (let hex of utils.hexFormatValues(rawData.slice(112, 113))) {
        models.channel_update.signature.message_flags += hex
    } 

    // channel_flags
    for (let hex of utils.hexFormatValues(rawData.slice(113, 114))) {
        models.channel_update.signature.channel_flags += hex
    } 

    // cltv_expiry_delta
    for (let hex of utils.hexFormatValues(rawData.slice(114, 116))) {
        models.channel_update.cltv_expiry_delta += hex
    }
    models.channel_update.cltv_expiry_delta = parseInt(models.channel_update.cltv_expiry_delta, 16)

    // htlc_minimum_msat
    for (let hex of utils.hexFormatValues(rawData.slice(116, 124))) {
        models.channel_update.htlc_minimum_msat += hex
    }
    models.channel_update.htlc_minimum_msat = parseInt(models.channel_update.htlc_minimum_msat, 16)

    // fee_base_msat
    for (let hex of utils.hexFormatValues(rawData.slice(124, 128))) {
        models.channel_update.fee_base_msat += hex
    }
    models.channel_update.fee_base_msat = parseInt(models.channel_update.fee_base_msat, 16)

    // fee_proportional_millionths
    for (let hex of utils.hexFormatValues(rawData.slice(128, 132))) {
        models.channel_update.fee_proportional_millionths += hex
    }
    models.channel_update.fee_proportional_millionths = parseInt(models.channel_update.fee_proportional_millionths, 16)

    if(rawData.length == 140) {
        // fee_proportional_millionths
        for (let hex of utils.hexFormatValues(rawData.slice(132, 140))) {
            models.channel_update.fee_proportional_millionths += hex
        }
        models.channel_update.fee_proportional_millionths = parseInt(models.channel_update.fee_proportional_millionths, 16)
    }

    return models.channel_update;
}

module.exports = { 
    channelUpdateParser
}