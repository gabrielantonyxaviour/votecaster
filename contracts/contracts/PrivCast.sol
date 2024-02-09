// SPDX:License-Identifier: MIT

pragma solidity ^0.8.0;


contract PrivCast{

    struct Poll{
        uint256 id;
        string pollUri;
        uint256[4] votes;
    }

    mapping(uint256=>mapping(uint256=>bool)) public votes;
    mapping(uint256=>Poll) public polls;

    constructor() {

    }

    event PollCreated(uint256 pollId, uint256 creatorFarcasterId, address createrAddress, string pollUri);
    event VoteCast(uint256 pollId, uint256 optionId);

    function createPoll() public returns (uint256) {
        return 1;
    }


    function castVote(uint256 pollId, uint256 optionId) public {
        require(optionId > 0, "Invalid option");
    }


}