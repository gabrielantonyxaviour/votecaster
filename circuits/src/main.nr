use dep::std;
use dep::ecrecover;

#[oracle(getFid)]
unconstrained fn farcaster_id(address: Field) -> Field {}

unconstrained fn get_farcaster_id(address: Field) -> Field {
    farcaster_id(address)
}

fn main(
    signer_pub_x_key: [u8; 32],
    signer_pub_y_key: [u8; 32],
    signature: [u8; 64],
    hashed_message: [u8; 32],
    farcaster_id: Field,
    vote_priv: Field,
    poll_id: pub [u8; 32],
    vote: pub Field,
    nullifier: pub [u8; 32]
) -> pub [u8; 32] {
    // TODO: eth-signed hash
    // // let hash_data: [u8; 32] = get_hash_data(poll_id, farcaster_id.to_be_bytes(32));
    let computedAddress: Field = ecrecover::secp256k1::PubKey::from_xy(signer_pub_x_key, signer_pub_y_key).to_eth_address(); // Compute address from public key
    let recoveredAddress = ecrecover::ecrecover(signer_pub_x_key, signer_pub_y_key, signature, hashed_message); // Ecrecover signature and verify
    assert(recoveredAddress == computedAddress); // Check recovered address is computed address

    let gen_nullifier = std::hash::keccak256(signature, 64); // generate nullifier
    assert(gen_nullifier == nullifier); // Check if nullifier hash is valid

    let fid: Field = get_farcaster_id(recoveredAddress); // Call oracle to get farcaster id
    assert(fid != 0); // Check if farcaster id is non zero
    assert(fid == farcaster_id); // Check if farcaster id is valid

    assert(vote as u8 == vote_priv as u8); // Check if the vote is right

    // Return nullifier
    nullifier
}

fn get_hash_data(poll_id: [u8; 32], farcaster_id: [u8]) -> [u8; 32] {
    let mut combined_key: [u8; 64] = [0; 64];
    for i in 0..32 {
        combined_key[i]=poll_id[i];
    }
    for i in 0..32 {
        combined_key[i+32]=farcaster_id[i];
    }

    let hashed_message = std::hash::keccak256(combined_key, 64);
    hashed_message
}

fn u8_to_u160(array: [u8]) -> Field {
    let mut addr: Field = 0;
    for i in 0..20 {
        // only take the last 20 bytes of the hash
        addr = (addr * 256) + (array[i] as Field);
    }
    addr
}
