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

    event PollCreated(uint256 pollId, address creatorAddress, string pollUri,uint256 createdTimestamp, uint256 validityDuration, bool isAnonAadharEnabled);
    event VoteCast(uint256 pollId, uint256 nullifierHash,uint256 optionId);

    function createPoll(string memory pollUri, uint256 validityDuration,bool isAnonAadharEnabled) public  {
        polls[pollIdCounter]=Poll(pollIdCounter,pollUri, [uint256(0),uint256(0),uint256(0),uint256(0)],block.timestamp,validityDuration,isAnonAadharEnabled,true);
        emit PollCreated(pollIdCounter, msg.sender, pollUri, block.timestamp, validityDuration, isAnonAadharEnabled);
        pollIdCounter++;    
    }

    function castVoteWithoutAnonAadhar(bytes memory proof, uint256 pollId, uint256 vote, uint256 nullifierHash) public {
        require(polls[pollId].isExists,"Poll does not exist");
        require(polls[pollId].isAnonAadharEnabled==false,"Anon Aadhar disabled");
        
        require(!farcasterNullifiers[pollId][nullifierHash],"Vote already casted");
        require(verifyFarcasterProof(proof, pollId, vote, nullifierHash),"Invalid proof");
        
        polls[pollId].votes[vote]++;
        emit VoteCast(pollId, nullifierHash, vote);
    }

    function castVoteWithAnonAadhar(bytes memory proof, uint256 pollId, uint256 vote, uint256 nullifierHash, AnonAadhaarInput memory anonParams) public {
        require(polls[pollId].isExists,"Poll does not exist");
        require(polls[pollId].isAnonAadharEnabled==true,"Invalid call");
        
        require(!farcasterNullifiers[pollId][nullifierHash],"Noir: Vote already casted");
        require(verifyFarcasterProof(proof, pollId, vote, nullifierHash),"Noir: Invalid proof");

        require(!anonAadhaarNullifier[pollId][anonParams.userNullifier],"Anon: Vote already casted");
        require(verifyAnonAadharProof(anonParams),"Anon: Invalid proof");

        polls[pollId].votes[vote]++;
        emit VoteCast(pollId, nullifierHash, vote);
    }

    function verifyFarcasterProof(bytes memory proof,uint256 pollId, uint256 _vote, uint256 _nullifierHash) public view returns(bool){
        bytes32[] memory publicInputs = new bytes32[](3);
        publicInputs[0] = bytes32(pollId);
        publicInputs[1] = bytes32(_vote);
        publicInputs[2] = bytes32(_nullifierHash);
        
        try farcasterVerifier.verify(proof, publicInputs)
        {
            return true;
        }catch{
            return false;
        }
    }

    function verifyAnonAadharProof(AnonAadhaarInput memory anonParams) public view returns(bool){
        require(addressToUint256(msg.sender) == anonParams.signal, "[AnonAadhaarVote]: wrong user signal sent.");
        require(isLessThan3HoursAgo(anonParams.timestamp) == true, "[AnonAadhaarVote]: Proof must be generated with Aadhaar data generated less than 3 hours ago.");
        return IAnonAadhaar(anonAadhaarVerifierAddr).verifyAnonAadhaarProof(anonParams.identityNullifier, anonParams.userNullifier, anonParams.timestamp, anonParams.signal, anonParams.groth16Proof);
    }

    function isLessThan3HoursAgo(uint timestamp) public view returns (bool) {
        return timestamp > (block.timestamp - 3 * 60 * 60);
    }

    function addressToUint256(address _addr) private pure returns (uint256) {
        return uint256(uint160(_addr));
    }


}