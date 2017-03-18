function count(){
	ImageList.getImageCount().then(function(data){
		console.log(data.toNumber());
	});
}

function add(){
	x = Controller.addImage("lexicographical", "caption", 4564,546564,54, {gas:1000000}).then(function(data){console.log(data);});
}

function getLatLong(){
	ImageList.getImagesWithLatLong(2,4565,546564,0).then(function(data){
		console.log(allToNumber(data[0]));
		console.log(data[1].toNumber());
		ImageList.getImagesWithLatLong(2,4565,546564,data[1].toNumber()).then(function(data){
			console.log(allToNumber(data[0]));
			console.log(data[1].toNumber());
		});
	});
}

function getAll(){
	UserList.getImages().then(function(data){
		console.log(allToNumber(data));
	});
}

function getImage(i){
	ImageList.getImageAtIndex(i).then(function(data) {console.log(data);});
}

function allToNumber(list){
	x = [];
	for (var i in list){
		if (list.hasOwnProperty(i)) {
			x.push(list[i].toNumber());
		}
	}
	return x;
}