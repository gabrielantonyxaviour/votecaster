use dep::std;
use dep::ecrecover;

fn main(
    pub_key_x: [u8; 32],
    pub_key_y: [u8; 32],
    signature: [u8; 64],
    hashed_message: pub [u8; 32]
) -> pub Field {
    let address = ecrecover::ecrecover(pub_key_x, pub_key_y, signature, hashed_message);
    std::println(address);

    address // address is represented as `Field`, but is constrained to be within 160 bits
}
