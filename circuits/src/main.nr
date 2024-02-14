use dep::std;

#[oracle(getFid)]
unconstrained fn farcaster_id(address: Field) -> Field {}

unconstrained fn get_farcaster_id(address: Field) -> Field {
    farcaster_id(address)
}

fn main(address: Field) -> pub Field {
    get_farcaster_id(address)
}
