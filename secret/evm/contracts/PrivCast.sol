// SPDX:License-Identifier: MIT

pragma solidity ^0.8.0;


contract PrivCast{

    struct Poll{
        uint256 id;
        string pollUri;
        uint256[4] votes;
        uint256 createdTimestamp;
        uint256 validityDuration;
        bool isExists;
    }

    mapping(uint256=>mapping(uint256=>bool)) public farcasterNullifiers; // pollId => nullifier => hasVoted
    mapping(uint256=>Poll) public polls; // pollId => poll

    uint256 public pollIdCounter;
    address public anonAadhaarVerifierAddr;

    constructor() {
        pollIdCounter=0;
    }

    event PollCreated(uint256 pollId, address creatorAddress, string pollUri,uint256 createdTimestamp, uint256 validityDuration);
    event VoteCast(uint256 pollId, uint256 nullifierHash,uint256 optionId);

    function createPoll(string memory pollUri, uint256 validityDuration) public  {
        polls[pollIdCounter]=Poll(pollIdCounter,pollUri, [uint256(0),uint256(0),uint256(0),uint256(0)],block.timestamp,validityDuration,true);
        emit PollCreated(pollIdCounter, msg.sender, pollUri, block.timestamp, validityDuration);
        pollIdCounter++;    
    }

    function castVote(bytes memory proof, uint256 pollId, uint256 vote, uint256 nullifierHash) public {
        require(polls[pollId].isExists,"Poll does not exist");
        
        require(!farcasterNullifiers[pollId][nullifierHash],"Vote already casted");
        require(verifyFarcasterProof(proof, pollId, vote, nullifierHash),"Invalid proof");
        
        polls[pollId].votes[vote]++;
        emit VoteCast(pollId, nullifierHash, vote);
    }

    function verifyFarcasterProof(bytes memory proof,uint256 pollId, uint256 _vote, uint256 _nullifierHash) public view returns(bool){
        bytes32[] memory publicInputs = new bytes32[](3);
        publicInputs[0] = bytes32(pollId);
        publicInputs[1] = bytes32(_vote);
        publicInputs[2] = bytes32(_nullifierHash);
    }
}