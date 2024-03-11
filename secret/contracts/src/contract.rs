use std::collections::HashMap;

use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult,
};

use crate::msg::{ExecuteMsg, InstantiateMsg, PollCountResponse,PollResponse, QueryMsg, ResultsResponse, VoteCountResponse, HasVotedResponse};
use crate::state::{ Poll, Polls,POLL_COUNT, POLLS};

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {

    deps.api
        .debug(format!("Contract was initialized by {}", info.sender).as_str());

    Ok(Response::default())
}

#[entry_point]
pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> StdResult<Response> {
    match msg {
        ExecuteMsg::CreatePoll { poll_uri , validity} => try_create_poll(deps, env, poll_uri, validity),
        ExecuteMsg::Vote {farcaster_id,poll_id, vote } => try_vote(deps, env, info, poll_id, farcaster_id, vote),
    }
}

pub fn try_create_poll(deps: DepsMut,env: Env, poll_uri: String, validity: u64) -> StdResult<Response> {
      // Update decrypted_votes logic

    let mut poll_count=POLL_COUNT.load(deps.storage).unwrap_or(0);
    let mut polls = POLLS
      .load(deps.storage)
      .unwrap_or(Polls {
          polls: Vec::new(),
      });

    polls.polls.push(Poll{
        id: poll_count as u64,
        uri: poll_uri,
        created_at: env.block.time,
        validity: validity,
        votes: HashMap::new(),
        has_voted: HashMap::new(),
        vote_count: 0,
    });

    poll_count=poll_count+1;

    // Save decrypted votes to storage
    POLLS.save(deps.storage, &polls)?;
    POLL_COUNT.save(deps.storage, &poll_count)?;

    deps.api.debug("poll created successfully");
    Ok(Response::default().add_attribute_plaintext("poll_id", (poll_count-1).to_string()))
}


pub fn try_vote(deps: DepsMut, env: Env, info: MessageInfo, poll_id: u64, farcaster_id: u64, vote: u64) -> StdResult<Response> {
    let mut poll_count=POLL_COUNT.load(deps.storage).unwrap_or(0);
    let mut polls = POLLS
      .load(deps.storage)
      .unwrap_or(Polls {
          polls: Vec::new(),
      });
   
    // check if poll exists
    if poll_id >= poll_count {
        return Err(StdError::generic_err("Invalid poll id"));
    }

    if let Some(poll) = polls.polls.get_mut(poll_id as usize) {
        // check if voting is live
        if env.block.time.seconds() > poll.created_at.seconds() + poll.validity {
            return Err(StdError::generic_err("Voting has ended"));
        }
        
        // check if already voted
        if poll.has_voted.contains_key(&farcaster_id) {
            return Err(StdError::generic_err("Already voted")); 
        }
    
        poll.votes.insert(vote, poll.votes.get(&vote).unwrap_or(&0) + 1);
        poll.has_voted.insert(farcaster_id, true);
    
        POLLS.save(deps.storage, &polls)?;
    }else{
        return Err(StdError::generic_err("Poll not found"))

    }

    Ok(Response::default())
}


#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetPollCount {} => to_binary(&query_poll_count(deps)?),  
        QueryMsg::GetVoteCount {poll_id} => to_binary(&query_vote_count(deps, poll_id)?),
        QueryMsg::GetResults {poll_id} => to_binary(&query_get_results(deps, poll_id)?),  
        QueryMsg::GetVoted {poll_id, farcaster_id} => to_binary(&query_check_voted(deps, poll_id, farcaster_id)?),
    }
}

fn query_poll_count(deps: Deps) -> StdResult<PollCountResponse> {
    let mut poll_count=POLL_COUNT.load(deps.storage).unwrap_or(0);
    Ok(PollCountResponse { poll_count: poll_count })
}

fn query_vote_count(deps: Deps, poll_id: u64) -> StdResult<VoteCountResponse> {
    let mut poll_count=POLL_COUNT.load(deps.storage).unwrap_or(0);
    let mut polls = POLLS
      .load(deps.storage)
      .unwrap_or(Polls {
          polls: Vec::new(),
      });
    let poll = polls.polls.get(poll_id as usize).unwrap();
    Ok(VoteCountResponse { vote_count: poll.vote_count })
}

fn query_check_voted(deps: Deps, poll_id: u64, farcaster_id: u64) -> StdResult<HasVotedResponse> {
    let mut polls = POLLS
    .load(deps.storage)
    .unwrap_or(Polls {
        polls: Vec::new(),
    });
  let poll = polls.polls.get(poll_id as usize).unwrap();
  Ok(HasVotedResponse { has_voted: poll.has_voted.contains_key(&farcaster_id)})
}

fn query_get_results(deps: Deps, poll_id: u64) -> StdResult<ResultsResponse> {
    let mut poll_count=POLL_COUNT.load(deps.storage).unwrap_or(0);
    let mut polls = POLLS
      .load(deps.storage)
      .unwrap_or(Polls {
          polls: Vec::new(),
      });
    let poll = polls.polls.get(poll_id as usize).unwrap();
    Ok(ResultsResponse {results: poll.votes.clone()})
}


fn query_get_poll(deps: Deps, poll_id: u64) -> StdResult<PollResponse> {
    let mut poll_count=POLL_COUNT.load(deps.storage).unwrap_or(0);
    let mut polls = POLLS
      .load(deps.storage)
      .unwrap_or(Polls {
          polls: Vec::new(),
      });
    let poll = polls.polls.get(poll_id as usize).unwrap();
    Ok(PollResponse {poll: poll.clone()})
}