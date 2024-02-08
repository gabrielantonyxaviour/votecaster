// use dep::std;
// use dep::ecrecover;

// // Oracle
// fn check_farcaster_id(farcasterId: Field, voter: Field)-> pub bool {
//   true
// }

// fn main(
//   pub_key_x: [u8; 32],
//   pub_key_y: [u8; 32],
//   signature: [u8; 64],
//   merkle_path: [Field; 4],
//   voter: Field,
//   farcasterId: Field,
//   nullifier: pub Field,
//   new_merkle_root: pub Field,
//   vote: pub u8
//   ) {
//     // verify signature (Aim: Check if he intented to vote)

//     // find a way for nullifier (Aim: Check if already voted)
//     // recursive proofs hopefully

//     // check farcaster id (Aim: Check validity of the farcaster id)
//     // Use oracle
// }

// #[test]
// fn test_main() {

// }

fn main(x: Field, y: Field) {
    assert(x == y, "x is not equal to y");
}

#[test]
fn test_main() {
    main(1, 1);
}

#[test(should_fail)]
fn test_main_fail() {
    main(1, 2);
}
