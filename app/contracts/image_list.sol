pragma solidity ^0.4.0;

import './stl.sol';

contract ImageList is owned {

	struct Image{
		bool init;
		address owner;
		string image_hash;
		uint256 tags;
		uint32 rating;
		int64 lat;
		int64 long;
	}

	// TODO Make Events
	// TODO change msg.sender to tx.origin if origin in required
	
	mapping (address => uint[]) public userToImages;
	Image[] public imageList;
	uint deleted=0;

	modifier onlyImageOwner (uint index){
		if (index<imageList.length && imageList[index].owner == msg.sender) _;
	}
	
	modifier ifImageExists(uint index){
		if (index<imageList.length && imageList[index].init) _;
	}

	function addImage(string _hash, int64 _lat, int64 _long, uint256 _tags){
		var k = imageList.length;

		Image memory temp = Image(true, msg.sender, _hash, _tags, 0, _lat, _long);
		imageList.push(temp);
		userToImages[msg.sender].push(k);
	}

	function getWithLatLong(int rad, int64 x, int64 y, uint _count) constant returns(uint[], uint){

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

	function getImage(uint index) ifImageExists(index) constant returns (string, uint256, uint32, int64, int64){
		// TODO Exclude deleted images
		return (imageList[index].image_hash, imageList[index].tags, imageList[index].rating, imageList[index].lat, imageList[index].long);
	}

	// TODO: Test all delete corner cases
	function deleteImage(uint index) onlyImageOwner(index) {
		// When deleted entry is tried to be deleted again onlyImageOwner blocks the execution
		deleted++;
		delete imageList[index];
	}

	function getUserImages(address user) constant returns(uint256[]){
		// TODO Exclude deleted images
		return userToImages[msg.sender];
	}

	function getCount() constant returns (uint){
		return imageList.length-deleted;
	}


}
