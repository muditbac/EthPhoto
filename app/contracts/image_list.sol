pragma solidity ^0.4.0;

import './stl.sol';

contract ImageList is owned {

	struct Image{
		address owner;
		string image_hash;
		int256 tags;
		uint32 rating;
		int64 lat;
		int64 long;
	}

	mapping (address => uint256[]) userToImages;
	Image[] public imageList;

	function addImage(string _hash, int64 _lat, int64 _long, int256 t){
		imageList.length++;
		imageList[imageList.length-1].owner = msg.sender;
		imageList[imageList.length-1].image_hash = _hash;
		imageList[imageList.length-1].lat = _lat;
		imageList[imageList.length-1].long = _long;
		imageList[imageList.length-1].tags = t;
		userToImages[msg.sender].push(imageList.length);
	}

	function getWithLatLong(int rad, int64 x, int64 y) constant returns(uint256[]){
		uint256[] memory ids = new uint256[](100);
		int256 count=0;

		for (var i=0;i<imageList.length;i++){
			// Checking algorithm goes here
		}
		return ids;
	}

	function set(int64 _lat) constant returns (uint32[]){
	}

	function getImage(uint index) constant returns (string, int256, uint32, int64, int64){
		return (imageList[index].image_hash, imageList[index].tags, imageList[index].rating, imageList[index].lat, imageList[index].long);
	}


	function getCount() constant returns (uint){
		return imageList.length;
	}

}
