use std::collections::HashMap;

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use crate::state::{Poll};


#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct InstantiateMsg {

}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    CreatePoll { poll_uri: String, validity: u64 },
    Vote { poll_id: u64, vote: u64 , farcaster_id: u64 },
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetResults {poll_id: u64},
    GetPollCount {},
    GetVoteCount {poll_id: u64},
    GetVoted {poll_id: u64, farcaster_id: u64},
}

// We define a custom struct for each query response
#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct PollCountResponse{
    pub poll_count: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct VoteCountResponse{
    pub vote_count: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct  ResultsResponse{
    pub results: HashMap<u64, u64>,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct PollResponse{
    pub poll: Poll,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]

pub struct HasVotedResponse{
    pub has_voted: bool,
}