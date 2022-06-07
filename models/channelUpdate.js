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

module.exports = {
    channel_update
}