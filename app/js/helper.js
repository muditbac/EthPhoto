function count(){
	ImageList.getCount().then(function(data){
		console.log(data.toNumber());
	});
}

function add(){
	x = ImageList.addImage("lexicographical", 4564,546564,54, {gas:200000}).then(function(data){console.log(data);});
}

function getLatLong(){
	ImageList.getWithLatLong(2,4565,546564,0).then(function(data){
		console.log(allToNumber(data[0]));
		console.log(data[1].toNumber());
		ImageList.getWithLatLong(2,4565,546564,data[1].toNumber()).then(function(data){
			console.log(allToNumber(data[0]));
			console.log(data[1].toNumber());
		});
	});
}

function getAll(){
	ImageList.getUserImages().then(function(data){
		console.log(allToNumber(data));
	});
}

function getImage(i){
	ImageList.getImage(i).then(function(data) {console.log(data);});
}

function allToNumber(list){
	x = [];
	for (var i in list){
		x.push(list[i].toNumber());
	}

	return x;
}