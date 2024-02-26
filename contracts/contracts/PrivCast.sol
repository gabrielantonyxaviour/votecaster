// SPDX:License-Identifier: MIT

pragma solidity ^0.8.0;

import {UltraVerifier} from "./plonk_vk.sol";

contract PrivCast{

    struct Poll{
        uint256 id;
        string pollUri;
        mapping(uint256=>bool) hasVoted;
        uint256 createdTimestamp;
        uint256 validityDuration;
        bytes[] encryptedVotes;
        uint256 voteCount;
        bool isExists;
    }

    mapping(uint256=>Poll) public polls; // pollId => poll

    uint256 public pollIdCounter;
    UltraVerifier public farcasterVerifier;

    constructor() {
        pollIdCounter=0;
        farcasterVerifier = new UltraVerifier();
    }

    event PollCreated(uint256 pollId, address creatorAddress, string pollUri,uint256 createdTimestamp, uint256 validityDuration);
    event VoteCast(uint256 pollId, uint256 nullifierHash,bytes encryptedVote);

    function createPoll(string memory pollUri, uint256 validityDuration) public  {
        Poll storage poll=polls[pollIdCounter];
        poll.id=pollIdCounter;
        poll.createdTimestamp=block.timestamp;
        poll.validityDuration=validityDuration;
        poll.isExists=true;
        poll.pollUri=pollUri;
        emit PollCreated(pollIdCounter, msg.sender, pollUri, block.timestamp, validityDuration);
        pollIdCounter++;    
    }

    function castVote(bytes memory proof, uint256 pollId, bytes calldata encryptedVote, uint256 nullifierHash) public {
        Poll storage poll = polls[pollId];

        require(poll.isExists,"Poll does not exist");
        require(!poll.hasVoted[nullifierHash],"Already voted");
        require(verifyFarcasterProof(proof, pollId, keccak256(encryptedVote), nullifierHash),"Invalid proof");
        
        poll.encryptedVotes.push(encryptedVote);
        poll.voteCount++;
        poll.hasVoted[nullifierHash]=true;

        emit VoteCast(pollId, nullifierHash, encryptedVote);
    }

    function verifyFarcasterProof(bytes memory proof,uint256 pollId, bytes32 _vote, uint256 _nullifierHash) public view returns(bool){
        bytes32[] memory publicInputs = new bytes32[](3);
        publicInputs[0] = bytes32(pollId);
        publicInputs[1] = _vote;
        publicInputs[2] = bytes32(_nullifierHash);
        
        try farcasterVerifier.verify(proof, publicInputs)
        {
            return true;
        }catch{
            return false;
        }
    }

   

}