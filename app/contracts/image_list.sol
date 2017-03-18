pragma solidity ^0.4.0;

import './stl.sol';


contract UserList is owned {
	mapping (address => uint[]) public userToImages;
	mapping (address => uint) reward;

	function addReward(address _user, uint _reward) onlyOwner{
		reward[_user] += _reward;
	}

	function getImages() constant returns (uint[]){
		return userToImages[msg.sender];
	}

	function addImageToUser(address _user, uint _image) onlyOwner{
		userToImages[_user].push(_image);
	}
}

contract VotingList is owned {
	mapping (bytes32 => bool) public userImageUpvote;
	
	function upvoteImage(address _user, uint index) onlyOwner returns(bool) {
		var hash = sha3(_user, index);
		if (userImageUpvote[hash]==false){
			userImageUpvote[hash] = true;
			return true;	
		}
		else 
			return false;
	}

	function isUpvoted(uint index) constant returns(bool) {
		return userImageUpvote[sha3(msg.sender, index)];
	}
}

contract ImageList is owned {

	struct Image{
		bool init;
		address owner;
		string image_hash;
		string caption;
		uint topic;
		int rating;
		int64 lat;
		int64 long;
	}

	// UserList public ;
	Image[] public imageList;
	uint deleted=0;


	// TODO Make Events
	// TODO change msg.sender to tx.origin if origin in required
	// TODO appopriately change to private or public settings 

	modifier onlyImageOwner (address sender, uint index){
		if (index<imageList.length && (imageList[index].owner == sender)) _;
	}
	
	modifier ifImageExists(uint index){
		if (index<imageList.length && imageList[index].init) _;
	}

	function addImage(address sender, string _hash, string _caption, int64 _lat, int64 _long, uint256 _topic) onlyOwner returns (uint){
		var k = imageList.length;

		Image memory temp = Image(true, sender, _hash, _caption, _topic, 0, _lat, _long);
		imageList.push(temp);
		return k;
	}

	function exists(uint index) constant returns (bool){
		if (index<imageList.length && imageList[index].init) return true;
		return false;	
	}

	function getImagesWithLatLong(int rad, int64 x, int64 y, uint _count) constant returns(uint[], uint){

		uint[] memory ids = new uint[](_count);
		uint count=0;

		for (var i=0;i<imageList.length;i++){
			if (imageList[i].init && imageList[i].lat>=(x-rad) && imageList[i].lat<=(x+rad) && imageList[i].long>=(y-rad) && imageList[i].long<=(y+rad)){
				if (_count!=0) ids[count] =  i;
				count++;
			}
		}
		return (ids, count);
	}

	function getImage(uint index) ifImageExists(index) constant returns (string, string, int64, int64, uint, int){
		// TODO Exclude deleted images
		return (imageList[index].image_hash, imageList[index].caption, imageList[index].lat, imageList[index].long, imageList[index].topic, imageList[index].rating);
	}

	// TODO: Test all delete corner cases
	function deleteImage(address sender, uint index) onlyOwner onlyImageOwner(sender, index) {
		// When deleted entry is tried to delete again onlyImageOwner blocks the execution
		// TODO you can also just copy the last element into the empty spot, then delete the last element.
		deleted++;
		delete imageList[index];
	}

	function getImageCount() constant returns (uint){
		return imageList.length-deleted;
	}

	function getImageOwner(uint image_index) constant returns(address){
		return imageList[image_index].owner;
	}
}


contract Controller is owned {
	ImageList public imageList;
	UserList public userList;
	VotingList public votingList;

	function Controller(ImageList _imageList, UserList _userList, VotingList _votingList){
		imageList = _imageList;
		userList = _userList;
		votingList = _votingList;
	}

	function addImage(string _hash, string _caption, int64 _lat, int64 _long, uint256 _topic){
		var k = imageList.addImage(msg.sender, _hash, _caption, _lat, _long, _topic);
		userList.addImageToUser(msg.sender, k);
	}

	function deleteImage(uint index){
		imageList.deleteImage(msg.sender, index);
	}

	function upvoteImage(uint index){
		votingList.upvoteImage(msg.sender, index);
	}
}