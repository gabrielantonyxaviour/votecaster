use dep::std;

#[oracle(getFid)]
unconstrained fn farcaster_id(address: Field) -> Field {}

unconstrained fn get_farcaster_id(address: Field) -> Field {
    farcaster_id(address)
}

fn main(
    signer_address: Field,
    farcaster_id: Field,
    vote: u8,
    pollId: pub Field,
    nullifierHash: pub Field
) -> pub Field {
    // Compute hashed data
    // Ecreover signature and verify
    // Call oracle to get farcaster id
    // Check if farcaster id is valid
    // Compute nullifier hash
    // Check if nullifier hash is valid
    // return nullifier hash

    let fid= get_farcaster_id(signer_address);
    assert(fid == 249577);
    fid
}
