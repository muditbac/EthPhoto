pragma solidity ^0.4.0;

import './stl.sol';

// Note: feature ananomonous upvoting and reporting
contract VotingList is owned {
	mapping (bytes32 => bool) public userImageUpvote;

	function upvoteImage(address _user, uint index, bool isReport) onlyOwner returns(bool) {
		var hash = sha3(_user, index, isReport);
		if (userImageUpvote[hash] == false){
			userImageUpvote[hash] = true;
			return true;
		}
		else{
			return false;
		}
	}

	function isUpvoted(uint index, bool isReport) constant returns(bool) {
		return userImageUpvote[sha3(msg.sender, index, isReport)];
	}
}
