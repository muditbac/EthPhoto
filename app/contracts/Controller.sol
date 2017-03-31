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

  /**
			A function to add an image by calling ImageList and UserImage classes.
	**/
	function addImage(string _hash, string _caption, int64 _lat, int64 _long, uint16[5] _topic){
		var k = imageList.addImage(msg.sender, _hash, _caption, _lat, _long, _topic);
		userList.addImageToUser(msg.sender, k);
    userList.addReward(msg.sender, 10);
	}

  /**
			A function to delete an image by calling ImageList class
	**/
	function deleteImage(uint index){
		imageList.deleteImage(msg.sender, index);
	}

  /**
			A function to upvote an image by calling the ImageList, UserList and VotingList	classes.
	**/
	function upvoteImage(uint index){
		if (imageList.ifImageExists(index) && !(imageList.getImageOwner(index)==msg.sender))
			if (votingList.upvoteImage(msg.sender, index, false)){
				imageList.upvoteImage(index);
				userList.addReward(imageList.getImageOwner(index), 2);
			}
	}

  /**
			A function to report an image by calling the ImageList, UserList and VotingList	classes.
	**/
	function reportImage(uint index){
		if (imageList.ifImageExists(index) && !(imageList.getImageOwner(index)==msg.sender))
			if (votingList.upvoteImage(msg.sender, index, true)){
				imageList.reportImage(index);
        userList.addReward(msg.sender, -1);
        userList.addReward(imageList.getImageOwner(index), -2);
        if (imageList.getReports(index)%10==0){
          userList.addReward(imageList.getImageOwner(index), -30);
        }
			}
	}
}
