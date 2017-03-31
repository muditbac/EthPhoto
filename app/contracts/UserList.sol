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
			TODO To be decided how to add reward?
	**/
	function addReward(address _user, uint _reward) onlyOwner{
		addressToUserData[_user].reward += _reward;
	}

	function addImageToUser(address _user, uint _image) onlyOwner{
		addressToUserData[_user].userImages.push(_image);
	}

	function setUserName(bytes32 _uname){
		if(usernameToUser[_uname] == address(0x0)){
			usernameToUser[_uname] = msg.sender;
			addressToUserData[msg.sender].username = _uname;
			addressToUserData[msg.sender].reward = 100;
			setUserNameEvent(true);
		}
		else{
			setUserNameEvent(false);
		}
	}

	function isUsernameSet() constant returns (bool){
		if(bytes32(0) == addressToUserData[msg.sender].username){
			return false;
		}
		return true;
	}


    function getUserInfo(address _user) constant returns (bytes32 username, uint[] images, uint reward){
        return (addressToUserData[_user].username, addressToUserData[_user].userImages, addressToUserData[_user].reward);
    }

	function getReward(address _user) constant returns (uint){
		return addressToUserData[_user].reward;
	}


	function getReward() constant returns (uint){
		return addressToUserData[msg.sender].reward;
	}

	function getImages() constant returns (uint[]){
		return addressToUserData[msg.sender].userImages;
	}

  function getImages(address _user) constant returns (uint[]){
		return addressToUserData[_user].userImages;
	}

  function getUserName() constant returns (bytes32){
		return addressToUserData[msg.sender].username;
	}

	function getUserName(address _user) constant returns (bytes32){
		return addressToUserData[_user].username;
	}


}
