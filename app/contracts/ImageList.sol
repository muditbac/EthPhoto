pragma solidity ^0.4.0;

import './stl.sol';

contract ImageList is owned {

	struct Image{
		bool init;
		address owner;
		string image_hash;
		string caption;
		int64 lat;
		int64 long;
		uint16[5] topic;
		uint8 reportCount;
		int upvotes;
	}

	// UserList public ;
	Image[] public imageList;
	uint deleted=0;


	// TODO Make Events
	// TODO appopriately change to private or public settings

	/**
			A utility modifier to replace the specified condition.
	**/
	modifier onlyImageOwner (address sender, uint index){
		if (index<imageList.length && (imageList[index].owner == sender)) _;
	}

	/**
			A function to check if an image exists at the index passed.
	**/
	function ifImageExists(uint index) returns (bool){
		if (index<imageList.length && imageList[index].init) return true;
		return false;
	}

	/**
			A function to add image information to the Image struct.
			A temp Image struct is created and pushed in the dynamic array imagelist.
			It returns one less than the length of the imagelist array.
	**/
	function addImage(address sender, string _hash, string _caption, int64 _lat, int64 _long, uint16[5] _topic) onlyOwner returns (uint){
		var k = imageList.length;

		Image memory temp = Image(true, sender, _hash, _caption, _lat, _long, _topic, 0, 0);
		imageList.push(temp);
		return k;
	}

	/**
			A function to get the images in a range about some x and y coordinates passed.
			A linear search is done on all the images.
	**/
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

	/**
			A function to get the array of images containing the tags passed.
			A linear search is done on the images.
	**/
	function getImagesWithTags(uint16[3] tags, uint _count) constant returns(uint[], uint){

		uint[] memory ids = new uint[](_count);
		uint count=0;

		for (var i=0;i<imageList.length;i++){
			if (imageList[i].init){
				bool found=false;
				for(var j=0;j<5;j++){
					if (imageList[i].topic[j]==0) break;
					for(var k=0;k<3;k++){
						if (tags[k]==0) break;
						if (tags[k]==imageList[i].topic[j]){
							found=true;
							break;
						}
					}
					if (found) break;
				}

				if (found){
					if (_count!=0) ids[count] =  i;
					count++;
				}

			}
		}
		return (ids, count);
	}

	/**
			A function to add an upvote to the image.
	**/
	function upvoteImage(uint index) onlyOwner {
		imageList[index].upvotes ++;
	}

	function reportImage(uint index) onlyOwner {
		imageList[index].reportCount ++;
	}

	/**
			A function to get the total upvotes of the image passed.
	**/
	function getUpvotes(uint index) constant returns (int){
		return imageList[index].upvotes;
	}

	function getReports(uint index) onlyOwner constant returns (int){
		return imageList[index].upvotes;
	}

	/**
			A function to get the Image parameters(struct Image) of the image index passed.
	**/
	function getImage(uint index)  constant returns (string, string, int64, int64, uint16[5], int, address){
		if (ifImageExists(index))
			return (imageList[index].image_hash, imageList[index].caption, imageList[index].lat, imageList[index].long, imageList[index].topic, imageList[index].upvotes, imageList[index].owner);
	}

	/**
			A function to delete the image passed.
			Image will be deleted only if the current user is the owner of the image.
			A counter deleted maintains the total number of deleted images.
	**/
	function deleteImage(address sender, uint index) onlyOwner onlyImageOwner(sender, index) returns (bool) {
		// When deleted entry is tried to delete again onlyImageOwner blocks the execution
		// TODO you can also just copy the last element into the empty spot, then delete the last element.
		deleted++;
		delete imageList[index];
			return true;
	}

	/**
			A function to get the total number of images.
	**/
	function getImageCount() constant returns (uint){
		return imageList.length-deleted;
	}

	/**
			A function to get the address of the owner of the image index passed.
	**/
	function getImageOwner(uint image_index) constant returns(address){
		return imageList[image_index].owner;
	}
}
