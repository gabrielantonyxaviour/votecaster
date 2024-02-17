// SPDX:License-Identifier: MIT

pragma solidity ^0.8.0;

import "@anon-aadhaar/contracts/interfaces/IAnonAadhaar.sol";
import "@anon-aadhaar/contracts/interfaces/IAnonAadhaarVote.sol";
import {UltraVerifier} from "./plonk_vk.sol";

contract PrivCast{

    struct Poll{
        uint256 id;
        string pollUri;
        uint256[4] votes;
        uint256 createdTimestamp;
        uint256 validityDuration;
        bool isAnonAadharEnabled;
        bool isExists;
    }
    struct AnonAadhaarInput{
        uint256 identityNullifier;
        uint256 userNullifier;
        uint256 timestamp;
        uint256 signal;
        uint256[8] groth16Proof;
    }

    mapping(uint256=>mapping(uint256=>bool)) public farcasterNullifiers; // pollId => nullifier => hasVoted
    mapping(uint256=>mapping(uint256=>bool)) public anonAadhaarNullifier; // pollId => nullifier => hasVoted
    mapping(uint256=>Poll) public polls; // pollId => poll

    uint256 public pollIdCounter;
    address public anonAadhaarVerifierAddr;
    UltraVerifier public farcasterVerifier;

    constructor(address _anonAaadharVerifier) {
        pollIdCounter=0;
        anonAadhaarVerifierAddr = _anonAaadharVerifier;
        farcasterVerifier = new UltraVerifier();
    }

    event PollCreated(uint256 pollId, address createrAddress, string pollUri,uint256 createdTimestamp, uint256 validityDuration, bool isAnonAadharEnabled);
    event VoteCast(uint256 pollId, uint256 nullifierHash,uint256 optionId);

    function createPoll(string memory pollUri, uint256 validityDuration,bool isAnonAadharEnabled) public  {
        polls[pollIdCounter]=Poll(pollIdCounter,pollUri, [uint256(0),uint256(0),uint256(0),uint256(0)],block.timestamp,validityDuration,isAnonAadharEnabled,true);
        emit PollCreated(pollIdCounter, msg.sender, pollUri, block.timestamp, validityDuration, isAnonAadharEnabled);
        pollIdCounter++;    
    }

    function castVote(bytes memory proof, uint256 pollId, uint256 vote, uint256 nullifierHash) public {
        require(polls[pollId].isExists,"Poll does not exist");
        require(polls[pollId].isAnonAadharEnabled==false,"Invalid call");
        _castVoteWithFarcasterProof(proof, pollId, vote, nullifierHash);
        polls[pollId].votes[vote]++;
        emit VoteCast(pollId, nullifierHash, vote);
    }

    function castVote(bytes memory proof, uint256 pollId, uint256 vote, uint256 nullifierHash, AnonAadhaarInput memory anonParams) public {
        require(polls[pollId].isExists,"Poll does not exist");
        require(polls[pollId].isAnonAadharEnabled==true,"Invalid call");
        
        _castVoteWithFarcasterProof(proof, pollId, vote, nullifierHash);
        _castVoteWithAnonAadhaarProof(pollId, anonParams);
        polls[pollId].votes[vote]++;
        emit VoteCast(pollId, nullifierHash, vote);
    }

    function isLessThan3HoursAgo(uint timestamp) public view returns (bool) {
        return timestamp > (block.timestamp - 3 * 60 * 60);
    }

    function addressToUint256(address _addr) private pure returns (uint256) {
        return uint256(uint160(_addr));
    }

    function _castVoteWithAnonAadhaarProof(uint256 pollId, AnonAadhaarInput memory anonParams) internal{
        require(anonAadhaarNullifier[pollId][anonParams.userNullifier]==false,"Vote already casted");
        require(addressToUint256(msg.sender) == anonParams.signal, "[AnonAadhaarVote]: wrong user signal sent.");
        require(isLessThan3HoursAgo(anonParams.timestamp) == true, "[AnonAadhaarVote]: Proof must be generated with Aadhaar data generated less than 3 hours ago.");
        require(IAnonAadhaar(anonAadhaarVerifierAddr).verifyAnonAadhaarProof(anonParams.identityNullifier, anonParams.userNullifier, anonParams.timestamp, anonParams.signal, anonParams.groth16Proof) == true, "[AnonAadhaarVote]: proof sent is not valid.");
        anonAadhaarNullifier[pollId][anonParams.userNullifier]=true;
    }

    function _castVoteWithFarcasterProof(bytes memory proof, uint256 pollId, uint256 vote, uint256 nullifierHash) internal {
        require(!farcasterNullifiers[pollId][nullifierHash],"Vote already casted");
        bytes32[] memory publicInputs = new bytes32[](3);
        publicInputs[0] = bytes32(pollId);
        publicInputs[1] = bytes32(vote);
        publicInputs[2] = bytes32(nullifierHash);
        // Verify the proof
        try farcasterVerifier.verify(proof, publicInputs)
        {
        
        }catch{
            revert("INVALID_PROOF");
        }
        farcasterNullifiers[pollId][nullifierHash]=true;
    }


}