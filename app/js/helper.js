function count(){
	ImageList.getImageCount().then(function(data){
		console.log(data.toNumber());
	});
}


function _base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function addImage(image_el, caption, lat, long, tags){

    return new Promise(function (resolve, reject) {
        lat = new web3.BigNumber(lat);
        lat = lat.mul(1e5).round();
        long = new web3.BigNumber(long);
        long = long.mul(1e5).round();

        var arr = _base64ToArrayBuffer(image_el.src.split(',')[1]);
        var buffer = EmbarkJS.Storage.ipfsConnection.Buffer.from(arr);
        EmbarkJS.Storage.ipfsConnection.add(buffer, function (err, result) {
            if (err) {
                reject(err);
            } else {
				Controller.addImage(result[0].path, caption, lat, long, tags, {gas: 1000000}).then(function(data){
				    data.hash = result[0].path;
					resolve(data);
				}, function(err){
					reject(err);
				});
            }
        });

    });
}

function getImagesWithLatLong(lat, long, rad){
    lat = Math.round(lat*1e5);
    long = Math.round(long*1e5);
    rad = Math.round(rad*1e5);

    var p =  new Promise(function (resolve, reject) {
        ImageList.getImagesWithLatLong(rad, lat, long).then(function (data){
            ImageList.getImagesWithLatLong(rad, lat, long, data[1]).then(function(data){
                p.data = allToNumber(data[0]);
                resolve(p.data);
            }, function(err){
                reject(err);
            })
        }, function(err){
            reject(err);
        })
    });

    return p;
}

// function getImage


function loadFile(element){
	console.log(element);
	files = element.files;
    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            document.getElementById('uploadedImage').src = fr.result;
        };
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
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
	var x = [];
	for (var i in list){
		if (list.hasOwnProperty(i)) {
			x.push(list[i].toNumber());
		}
	}
	return x;
}
