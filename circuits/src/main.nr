use dep::std;
use dep::ecrecover;

fn main(
    signer_pub_x_key: [u8; 32],
    signer_pub_y_key: [u8; 32],
    signature: [u8; 64],
    farcaster_id: Field,
    vote_priv: u8,
    poll_id: pub [u8; 32],
    nullifier: pub [u8; 32],
    vote: pub u8
) -> pub [u8; 32] {
    // Compute hashed data
    let hash_data: [u8; 32] = hash_nullifier(poll_id, farcaster_id.to_be_bytes(32));
    // Ecreover signature and verify
    let recoveredAddress: Field = ecrecover::ecrecover(signer_pub_x_key, signer_pub_y_key, signature, hash_data);
    // Compute address from public key 
    let address: Field = address_from_pub_key(signer_pub_x_key, signer_pub_y_key);
    // Check recovered address is computed address
    assert(recoveredAddress == address);

    // generate nullifier
    let gen_nullifier = std::hash::keccak256(signature, 64);
    // Check if nullifier hash is valid
    assert(gen_nullifier == nullifier);

    // Call oracle to get farcaster id
    let fid: Field = get_farcaster_id(address);
    // Check if farcaster id is valid
    assert(fid == farcaster_id);

    // Check if the vote is right
    assert(vote == vote_priv);

    // Return nullifier
    nullifier
}

fn hash_nullifier(poll_id: [u8; 32], farcaster_id: [u8]) -> [u8; 32] {
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

fn address_from_pub_key(pub_key_x: [u8; 32], pub_key_y: [u8; 32]) -> Field {
    let mut combined_key: [u8; 64] = [0; 64];
    for i in 0..64 {
        if i as u8 < 32 {
            combined_key[i]=pub_key_x[i];
        } else {
            combined_key[i]=pub_key_y[i as u8%32];
        }
    }
    let hashed_key= std::hash::keccak256(combined_key, 64);
    let mut generated_key: [u8]= [0; 20];
    for i in 0..20 {
        generated_key[i]=hashed_key[32-20+i];
    }
    u8_to_u160(generated_key)
}

fn u8_to_u160(array: [u8]) -> Field {
    let mut addr: Field = 0;
    for i in 0..20 {
        // only take the last 20 bytes of the hash
        addr = (addr * 256) + (array[i] as Field);
    }
    addr
}

#[oracle(getFid)]
unconstrained fn farcaster_id(address: Field) -> Field {}

unconstrained fn get_farcaster_id(address: Field) -> Field {
    farcaster_id(address)
}
