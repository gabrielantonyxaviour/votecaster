# priv.cast

## Contract Architecture

1. function createPoll(string memory q, uint256 options, uint256 farcasterId, address creator, uint8 privacyConfig, bytes memory signature)

   - Creates a poll with a unique poll id and emits an event.

2. function castVote(bytes32 pollId,uint8 selectedOption, bytes memory proof, bytes32 newMerkleRoot, bytes32 nullifierHash, bytes memory anonAadharProofs)
   - Will validate if the user has already voted. If not, updates the vote of the user.

## Circuit Architecture

1. fn main(voter_pub_key: Field, voter_signature: Field, hash_digest: pub Field, index: pub u8, new_merkle_root: pub Field, nullifier: pub Field)
   - Verify if signature is right
   - Check if the nullifierHash is already a part of the merkle root(if yes, then he already voted)
