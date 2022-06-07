const utils = require('../utilities/utilities')



function channelUpdateParser(rawData,scid,direction,timestamp) {
    // schema
    const channel_update = {
        scid: '',
        direction: '',
        timestamp: '',
        signature: '',
        chain_hash: '',
        short_channel_id: {
          block: '',
          tx_id: '',
          output_index: '',
          short_channel_id: ''
        },
        timestamp: '',
        message_flags: '',
        channel_flags: '',
        cltv_expiry_delta: '',
        htlc_minimum_msat: '',
        fee_base_msat: '',
        fee_proportional_millionths: '',
        htlc_maximum_msat: ''
    }

    // Scid
    channel_update.scid = scid;

    // direction
    channel_update.direction = direction;

    // timestamp
    channel_update.timestamp = String(timestamp);

    // signature
    for (let hex of utils.hexFormatValues(rawData.slice(2, 66))) {
        channel_update.signature += hex
    } 

    // chain_hash
    for (let hex of utils.hexFormatValues(rawData.slice(66, 98))) {
        channel_update.chain_hash += hex
    }

    // short_channel_id
    for (let hex of utils.hexFormatValues(rawData.slice(98, 101))) {
        channel_update.short_channel_id.block += hex
    } 
    for (let hex of utils.hexFormatValues(rawData.slice(101, 104))) {
        channel_update.short_channel_id.tx_id += hex
    }
    for (let hex of utils.hexFormatValues(rawData.slice(104, 106))) {
        channel_update.short_channel_id.output_index += hex
    }
    channel_update.short_channel_id.block = parseInt(channel_update.short_channel_id.block, 16)
    channel_update.short_channel_id.tx_id = parseInt(channel_update.short_channel_id.tx_id, 16)
    channel_update.short_channel_id.output_index = parseInt(channel_update.short_channel_id.output_index, 16)
    channel_update.short_channel_id.short_channel_id = channel_update.short_channel_id.block + "x" + channel_update.short_channel_id.tx_id + "x" + channel_update.short_channel_id.output_index

    // timeStamp
    for (let hex of utils.hexFormatValues(rawData.slice(108, 112))) {
        channel_update.timestamp += hex
    } 
    channel_update.timestamp = parseInt(channel_update.timestamp, 16)

    // message_flags
    for (let hex of utils.hexFormatValues(rawData.slice(112, 113))) {
        channel_update.signature.message_flags += hex
    } 

    // channel_flags
    for (let hex of utils.hexFormatValues(rawData.slice(113, 114))) {
        channel_update.signature.channel_flags += hex
    } 

    // cltv_expiry_delta
    for (let hex of utils.hexFormatValues(rawData.slice(114, 116))) {
        channel_update.cltv_expiry_delta += hex
    }
    channel_update.cltv_expiry_delta = parseInt(channel_update.cltv_expiry_delta, 16)

    // htlc_minimum_msat
    for (let hex of utils.hexFormatValues(rawData.slice(116, 124))) {
        channel_update.htlc_minimum_msat += hex
    }
    channel_update.htlc_minimum_msat = parseInt(channel_update.htlc_minimum_msat, 16)

    // fee_base_msat
    for (let hex of utils.hexFormatValues(rawData.slice(124, 128))) {
        channel_update.fee_base_msat += hex
    }
    channel_update.fee_base_msat = parseInt(channel_update.fee_base_msat, 16)

    // fee_proportional_millionths
    for (let hex of utils.hexFormatValues(rawData.slice(128, 132))) {
        channel_update.fee_proportional_millionths += hex
    }
    channel_update.fee_proportional_millionths = parseInt(channel_update.fee_proportional_millionths, 16)

    if(rawData.length == 140) {
        // fee_proportional_millionths
        for (let hex of utils.hexFormatValues(rawData.slice(132, 140))) {
            channel_update.fee_proportional_millionths += hex
        }
        channel_update.fee_proportional_millionths = parseInt(channel_update.fee_proportional_millionths, 16)
    }

    return channel_update;
}

module.exports = { 
    channelUpdateParser
}