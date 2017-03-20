pragma solidity ^0.4.0;

import './stl.sol';

contract UserList is owned {

	/**
			Event thrown indicating the success/failure of the setUserName function
			Event is passed as true for success and false for failure.
	**/
	event setUserNameEvent(bool success);

	/**
			Struct to store all the user related properties, will be suitable for
			adding new peoperties and scalability.
	**/
	struct User {
			 uint[] userImages;
			 uint reward;
			 bytes32 username;
	}

	/**
			A mapping from user address to userdata(User struct) and
			another mapping from username to user address.
			username is stored as a bytes32 type.
	**/
	mapping (address => User) public addressToUserData;
	mapping (bytes32 => address) public usernameToUser;

	/**
			To be decided how to add reward?
	**/
	function addReward(address _user, uint _reward) onlyOwner{
		addressToUserData[_user].reward += _reward;
	}

	function addImageToUser(address _user, uint _image) onlyOwner{
		addressToUserData[_user].userImages.push(_image);
	}

	function setUserName(bytes32 _uname){
		address empty;
		if(usernameToUser[_uname] == empty){
			usernameToUser[_uname] = msg.sender;
			addressToUserData[msg.sender].username = _uname;
			setUserNameEvent(true);
		}
		else{
			setUserNameEvent(false);
		}
	}

	function isUsernameSet() constant returns (bool){
		bytes32 empty;
		if(empty == addressToUserData[msg.sender].username){
			return false;
		}
		return true;
	}


	function getReward(address _user) constant returns (uint){
		return addressToUserData[_user].reward;
	}
	function getReward() constant returns (uint){
		return addressToUserData[msg.sender].reward;
	}

	function getImages(address _user) constant returns (uint[]){
		return addressToUserData[_user].userImages;
	}
	function getImages() constant returns (uint[]){
		return addressToUserData[msg.sender].userImages;
	}

	function getUserName(address _user) constant returns (bytes32){
		return addressToUserData[_user].username;
	}
	function getUserName() constant returns (bytes32){
		return addressToUserData[msg.sender].username;
	}

}


contract VotingList is owned {
	mapping (bytes32 => bool) public userImageUpvote;

	function upvoteImage(address _user, uint index) onlyOwner returns(bool) {
		var hash = sha3(_user, index);
		if (userImageUpvote[hash] == false){
			userImageUpvote[hash] = true;
			return true;
		}
		else{
			return false;
		}
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
		uint8 topicCount;
		uint8 reportCount;
		uint16[5] topic;
		int upvotes;
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

	function ifImageExists(uint index) returns (bool){
		if (index<imageList.length && imageList[index].init) return true;
		return false;
	}

	function addImage(address sender, string _hash, string _caption, int64 _lat, int64 _long, uint16[5] _topic, uint8 _topicCount) onlyOwner returns (uint){
		var k = imageList.length;

		Image memory temp = Image(true, sender, _hash, _caption, 0, 0, _topic, 0, _lat, _long);
		imageList.push(temp);
		return k;
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

	function upvoteImage(uint index) onlyOwner {
		imageList[index].upvotes ++;
	}

	function getUpvotes(uint index) constant returns (int){
		return imageList[index].upvotes;
	}

	function getImage(uint index)  constant returns (string, string, int64, int64, uint16[5], int){
		// TODO Exclude deleted images
		if (ifImageExists(index))
			return (imageList[index].image_hash, imageList[index].caption, imageList[index].lat, imageList[index].long, imageList[index].topic, imageList[index].upvotes);
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

	function addImage(string _hash, string _caption, int64 _lat, int64 _long, uint16[5] _topic, uint8 _topicCount){
		var k = imageList.addImage(msg.sender, _hash, _caption, _lat, _long, _topic, _topicCount);
		userList.addImageToUser(msg.sender, k);
	}

	function deleteImage(uint index){
		imageList.deleteImage(msg.sender, index);
	}

	function upvoteImage(uint index){
		if (imageList.ifImageExists(index) && !(imageList.getImageOwner(index)==msg.sender))
			if (votingList.upvoteImage(msg.sender, index)){
				imageList.upvoteImage(index);
			}
	}
}
