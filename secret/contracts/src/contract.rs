use std::collections::HashMap;

use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult,
};

use crate::msg::{ExecuteMsg, InstantiateMsg, PollCountResponse, QueryMsg, ResultsResponse, VoteCountResponse};
use crate::state::{config, config_read, Poll, State};

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let state = State {
        poll_count: 0,
        polls: vec![],

    };

    deps.api
        .debug(format!("Contract was initialized by {}", info.sender).as_str());
    config(deps.storage).save(&state)?;

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
    config(deps.storage).update(|mut state| -> Result<_, StdError> {
        state.polls.push(Poll {
            id: state.poll_count,
            uri: poll_uri,
            created_at: env.block.time,
            validity: validity,
            votes: HashMap::new(),
            has_voted: HashMap::new(),
            vote_count: 0,
        });
        state.poll_count += 1;
        Ok(state)
    })?;

    deps.api.debug("poll created successfully");
    Ok(Response::default())
}


pub fn try_vote(deps: DepsMut, env: Env, info: MessageInfo,poll_id: u64, farcaster_id: u64, vote: u64) -> StdResult<Response> {
    let state = config_read(deps.storage).load()?;
    let poll = state.polls.get(poll_id as usize).unwrap();
   
   // check if poll exists
    if(poll_id < 0 || poll_id >= state.poll_count){
        return Err(StdError::generic_err("Invalid poll id"));
    }
   
    // check if voting is live
    if(env.block.time.seconds() > poll.created_at.seconds() + poll.validity){
        return Err(StdError::generic_err("Voting has ended"));
    }
    
    // check if already voted
    if(poll.has_voted.contains_key(&farcaster_id)){
        return Err(StdError::generic_err("Already voted"));
    }

    config(deps.storage).update(|mut state| -> Result<_, StdError> {
        if let Some(poll) = state.polls.get_mut(poll_id as usize) {
            poll.votes.insert(vote, poll.votes.get(&vote).unwrap_or(&0) + 1);
            poll.has_voted.insert(farcaster_id, true);
            Ok(state)
        } else {
            // Handle the case where poll_id is out of bounds
            Err(StdError::generic_err("Invalid poll_id"))
        }
    })?;

    deps.api.debug("vote created successfully");
    Ok(Response::default())
}


#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetPollCount {} => to_binary(&query_poll_count(deps)?),  
        QueryMsg::GetVoteCount {poll_id} => to_binary(&query_vote_count(deps, poll_id)?),
        QueryMsg::GetResults {poll_id} => to_binary(&query_get_results(deps, poll_id)?),  
    }
}

fn query_poll_count(deps: Deps) -> StdResult<PollCountResponse> {
    let state = config_read(deps.storage).load()?;
    Ok(PollCountResponse { poll_count: state.poll_count })
}

fn query_vote_count(deps: Deps, poll_id: u64) -> StdResult<VoteCountResponse> {
    let state = config_read(deps.storage).load()?;
    let poll = state.polls.get(poll_id as usize).unwrap();
    Ok(VoteCountResponse { vote_count: poll.vote_count })
}

fn query_get_results(deps: Deps, poll_id: u64) -> StdResult<ResultsResponse> {
    let state = config_read(deps.storage).load()?;
    let poll = state.polls.get(poll_id as usize).unwrap();
    Ok(ResultsResponse {results: poll.votes.clone()})
}