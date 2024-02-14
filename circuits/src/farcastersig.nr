use dep::std;

#[oracle(getFid)]
unconstrained fn farcaster_signature(input: [Field; 2]) -> Field {}

unconstrained fn validate_farcaster_signature(input: [Field; 2]) -> Field {
    farcaster_signature(input)
}

fn main(farcaster_sig: Field, fid: Field) -> pub Field {
    validate_farcaster_signature([farcaster_sig, fid])
}
