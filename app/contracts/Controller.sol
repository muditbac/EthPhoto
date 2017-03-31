pragma solidity ^0.4.0;

import './stl.sol';
import './UserList.sol';
import './VotingList.sol';
import './ImageList.sol';


contract Controller is owned {

	ImageList public imageList;
	UserList public userList;
	VotingList public votingList;

	function Controller(ImageList _imageList, UserList _userList, VotingList _votingList){
		imageList = _imageList;
		userList = _userList;
		votingList = _votingList;
	}

	function addImage(string _hash, string _caption, int64 _lat, int64 _long, uint16[5] _topic){
		var k = imageList.addImage(msg.sender, _hash, _caption, _lat, _long, _topic);
		userList.addImageToUser(msg.sender, k);
	}

	function deleteImage(uint index){
		imageList.deleteImage(msg.sender, index);
	}

	function upvoteImage(uint index){
		if (imageList.ifImageExists(index) && !(imageList.getImageOwner(index)==msg.sender))
			if (votingList.upvoteImage(msg.sender, index, false)){
				imageList.upvoteImage(index);
				userList.addReward(imageList.getImageOwner(index), 2);
			}
	}

	function reportImage(uint index){
		if (imageList.ifImageExists(index) && !(imageList.getImageOwner(index)==msg.sender))
			if (votingList.upvoteImage(msg.sender, index, true)){
				imageList.upvoteImage(index);
//				userList.addReward(imageList.getImageOwner(index), -1);
			// TODO Decrease rating
			}
	}
}
