// SPDX:License-Identifier: MIT

pragma solidity ^0.8.0;


contract PrivCast{

    struct Poll{
        uint256 id;
        uint256 creatorFarcasterId;
        string pollUri;
        uint256[4] votes;
        uint256 createdTimestamp;
        uint256 validityDuration;
        bool isAnonAadharEnabled;
        bool isExists;
    }

    mapping(uint256=>mapping(uint256=>bool)) public votes; // pollId => nullifier => hasVoted
    mapping(uint256=>Poll) public polls; // pollId => poll

    uint256 public pollIdCounter;

    constructor() {
        pollIdCounter=0;
    }

    event PollCreated(uint256 pollId, uint256 creatorFarcasterId, address createrAddress, string pollUri,uint256 createdTimestamp, uint256 validityDuration, bool isAnonAadharEnabled);
    event VoteCast(uint256 pollId, uint256 nullifierHash,uint256 optionId);

    function createPoll(string memory pollUri, uint256 farcasterId,uint256 validityDuration,bool isAnonAadharEnabled,bytes memory proof) public returns (uint256) {
        polls[pollIdCounter]=Poll(pollIdCounter,farcasterId,pollUri, [uint256(0),uint256(0),uint256(0),uint256(0)],block.timestamp,validityDuration,isAnonAadharEnabled,true);
        emit PollCreated(pollIdCounter, farcasterId, msg.sender, pollUri, block.timestamp, validityDuration, isAnonAadharEnabled);
        pollIdCounter++;    
    }

    function castVote(uint256 pollId, uint256 optionId, bytes memory proof, uint256 nullifierHash) public {
        require(polls[pollId].isExists,"Poll does not exist");
        require(!votes[pollId][nullifierHash],"Vote already casted");
        polls[pollId].votes[optionId]++;
        votes[pollId][nullifierHash]=true;
        emit VoteCast(pollId, nullifierHash, optionId);
    }


}