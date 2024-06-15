// SPDX:License-Identifier: MIT

pragma solidity ^0.8.0;


contract PrivCast{

    struct Poll{
        uint256 id;
        string pollUri;
        mapping(address => bool) hasVoted;
        bytes[] encryptedVotes;
        uint256 voteCount;
        uint256 createdTimestamp;
        uint256 validityDuration;
        bool isExists;
    }

    mapping(uint256=>mapping(uint256=>bool)) public farcasterNullifiers; // pollId => nullifier => hasVoted
    mapping(uint256=>Poll) public polls; // pollId => poll

    uint256 public pollIdCounter;
    address public anonAadhaarVerifierAddr;


    event PollCreated(uint256 pollId, address creatorAddress, string pollUri, uint256 createdTimestamp, uint256 validityDuration);
    event VoteCast(uint256 pollId, uint256 voterFarcasterId, address voterAddress);

    function createPoll(string memory pollUri, uint256 validityDuration) public  {
        Poll storage poll = polls[pollIdCounter];
        poll.id = pollIdCounter;
        poll.pollUri = pollUri;
        poll.createdTimestamp = block.timestamp;
        poll.validityDuration = validityDuration;
        emit PollCreated(pollIdCounter, msg.sender, pollUri, block.timestamp, validityDuration);
        pollIdCounter++;
    }

    function getPoll(uint256 _pollId) external view returns (uint256, string memory, uint256, uint256, uint256, bool) {
        return (polls[_pollId].id, polls[_pollId].pollUri, polls[_pollId].voteCount, polls[_pollId].createdTimestamp, polls[_pollId].validityDuration, polls[_pollId].isExists);
    }

    function vote(uint256 pollId, uint256 farcasterId, bytes memory encryptedVote) external {
        require(!polls[pollId].hasVoted[msg.sender],"Already voted");
        require(!farcasterNullifiers[pollId][farcasterId],"Already voted");
        polls[pollId].encryptedVotes.push(encryptedVote);
        polls[pollId].hasVoted[msg.sender] = true;
        polls[pollId].voteCount++;
        farcasterNullifiers[pollId][farcasterId] = true;    
        emit VoteCast(pollId, farcasterId, msg.sender);
    }
    
    function getVotes(uint pollId) external view returns (bytes[] memory) {
        return polls[pollId].encryptedVotes;
    }

    struct PollInfo {
        uint id;
        string pollUri;
        uint voteCount;
        uint startTimestamp;
        uint validityDuration;
        bytes[] encryptedVotes;
    }

    function getAllPolls(bool open) external view returns (PollInfo[] memory) {
        uint count = 0;
        for (uint i = 1; i < pollIdCounter; i++) {
            if ((polls[i].createdTimestamp < polls[i].createdTimestamp + polls[i].validityDuration) == open) count++;
        }

        PollInfo[] memory pollsInfo = new PollInfo[](count);
        uint index = 0;
        for (uint i = 1; i < pollIdCounter; i++) {
            if ((polls[i].createdTimestamp < polls[i].createdTimestamp + polls[i].validityDuration) == open)  {
                Poll storage poll = polls[i];
                pollsInfo[index] = PollInfo({
                    id: poll.id,
                    pollUri: poll.pollUri,
                    voteCount: poll.voteCount,
                    startTimestamp: poll.createdTimestamp,
                    validityDuration: poll.validityDuration,
                    encryptedVotes: open ? new bytes[](0) : poll.encryptedVotes
                });
                index++;
            }
        }

        return pollsInfo;
    }
}