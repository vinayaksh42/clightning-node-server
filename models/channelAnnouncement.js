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

module.exports = {
    channel_announcement
}