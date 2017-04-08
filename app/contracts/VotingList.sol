pragma solidity ^0.4.0;

import './stl.sol';

// Note: feature ananomonous upvoting and reporting
contract VotingList is owned {

	/**
			A mapping from the hash to bool.
			The hash contains the user address ,the image index and a boolean isReport ,
			isReport represents the dislike/report feature .
			userImageUpvote is mapped to True if the user address (_user in hash)
			upvotes an image (index in hash) ,else False.
	**/
	mapping (bytes32 => bool) public userImageUpvote;

	/**
			A function to set the userImageUpvote for the user and image passed to True.
			If the user and image passed is already mapped to bool True then no changes
			are made and the function returns with a bool vlaue False.
	**/
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

	/**
			A function to check if the current user upvoted the image index passed.
	**/
	function isUpvoted(uint index, bool isReport) constant returns(bool) {
		return userImageUpvote[sha3(msg.sender, index, isReport)];
	}
}
