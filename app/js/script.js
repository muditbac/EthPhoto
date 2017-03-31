// All variables
var board = null;
var markers = {};
var images = {};
var myimages = {};
var images_dom = {};
var username = {};
var template_image = $("#image-cards > div");
var shown_images = [];

var my = {}

var min_cluster_size = 2;

var map_styles = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

toAscii = function(s){
    return web3.toAscii(s).replace(/\0/g,'');
};


function bounceMarkerCaller(element){
  var index = parseInt($(element).parent().attr('value'));
  bounceMarker(markers[index]);
}


function bounceMarker(marker){

//iterate over all clusters
var clusters=cluster.clusters_;
  for(var i = 0; i < clusters.length;++i){

    if(clusters[i].markers_.length >= min_cluster_size && clusters[i].clusterIcon_.div_){

        // clusters[i].clusterIcon_.div_ is the HTMLElement
        // that contains the wanted clusterIcon,
        // you should at first reset here recently applied changes
      var dom_ = clusters[i].clusterIcon_.div_;
      if(clusters[i].markers_.indexOf(marker)>-1){
        //the marker has been found, do something with it
        $(dom_).removeClass().addClass('bounce animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass();
        });
        return true;
      }
    }
    else {
      if(clusters[i].markers_.indexOf(marker)>-1){
        //the marker has been found, do something with it
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 750);
        console.log("found");
        return true;
      }
    }
  }
  return false;
}

function bounceImageCard(index){
  images_dom[index].addClass('shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('shake');
  });
}

alert = function(message, body){
  $.uiAlert({
    textHead: message,
    text: body,
    bgcolor: '#19c3aa',
    textcolor: '#fff',
    position: 'bottom-left', // top And bottom ||  left / center / right
    icon: 'checkmark box',
    time: 5
  });
};
alertErr = function(message, body = "Please try again after some time,.."){
  $.uiAlert({
    textHead: message,
    text: body,
    bgcolor: '#DB2828',
    textcolor: '#fff',
    position: 'bottom-left', // top And bottom ||  left / center / right
    icon: 'remove circle',
    time: 5
  });
};
alertInfo = function(message, body = ""){
  $.uiAlert({
    textHead: message,
    text: body,
    bgcolor: '#55a9ee',
    textcolor: '#fff',
    position: 'bottom-left', // top And bottom ||  left / center / right
    icon: 'info circle',
    time: 5
  });
};

var page = 1;
var total_pages = 1;

function changePagination(pageno, tpages){
  if (pageno!=null) {
    $("#right-main-wrapper > div > div.sixteen.wide.column > div.ui.right.floated.pagination.menu > a:nth-child(2) > span:nth-child(1)")
      .html(pageno);
    page = pageno;
  }
  if (tpages!=null) {
    $('#right-main-wrapper > div > div.sixteen.wide.column > div.ui.right.floated.pagination.menu > a:nth-child(2) > span:nth-child(2)')
      .html(tpages);
    total_pages = tpages
  }
}

function nextPage(){
  if (page<total_pages){
    current_images = all_images.slice(page*9, (page+1)*9);
    processMapChanges();
    changePagination(page+1, null);
  }
}

function prevPage(){
  if (page>1){
    changePagination(page-1, null);
    current_images = all_images.slice((page-1)*9, (page)*9);
    processMapChanges();
  }
}

function loadMyInfo(){
  UserList.getUserInfo(web3.eth.defaultAccount).then(function(data){
    my.username = toAscii(data[0]);
    myimages = data[1];
    my.reward = data[2].toNumber();
    setReward(my.reward);

    while (my.username=="" || my.username==null){
      my.username = prompt("Please Set Username")
      UserList.setUserName(my.username).then(function(){
        alertInfo("UserName successfully set");
      });
    }

    var div = $("#my-photos-div");
    var template = $('#my-images-template');
    for(var i in myimages){
      var index = myimages[i];
      getImage(index).then(function(data){
        // Update Data here
        var temp = template.clone();
        temp.attr("src", data[0]);
        temp.attr("data-caption", data[1]);
        temp.appendTo(div);
      });
    }

    // template.remove();

  }, function(err){

  })
}

function setReward(reward) {
  $("#my-reward").html(reward);
}

function isOwnerImage(index){
  return (images[index][6]==web3.eth.defaultAccount);
}

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // Loop through the FileList and render image files as thumbnails.
  for (var i = 0, f; f = files[i]; i++) {

    // Only process image files.
    if (!f.type.match('image.*')) {
      continue;
    }

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        var span = document.createElement('span');
        span.innerHTML = ['<img id="target" class="thumb" src="', e.target.result,
                          '" title="', escape(theFile.name), '"/>'].join('');
        document.getElementById('image-wrapper').insertBefore(span, null);
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }
}



// loading my images
$(document).ready(function(){
  loadMyInfo();
});

function setImageEditor(){
  board = new Darkroom('#target', {
    // Size options
    minWidth: 100,
    minHeight: 100,
    maxWidth: 600,
    maxHeight: 350,
    // ratio: 4/3,
    backgroundColor: '#000',

    // Plugins options
    /*plugins: {
      // save: false,
      crop: {
        quickCropKey: 67, //key "c"
        //minHeight: 50,
        //minWidth: 50,
        //ratio: 4/3
      }
    },*/

    // Post initialize script
    initialize: function() {
      var cropPlugin = this.plugins['crop'];
      // cropPlugin.selectZone(170, 25, 300, 300);
      cropPlugin.requireFocus();
    },
    save: {
      callback: function() {
          this.darkroom.selfDestroy(); // Cleanup
          var newImage = board.canvas.toDataURL();
          // fileStorageLocation = newImage;
          // console.log(imageObj);
        }
    }
  });
}

$("#image-upload-btn").on('click', function(){
  $("#image-wrapper span").remove();
  $("#image-upload").focus().trigger('click');
});

$("#image-upload").on('change', function(evt){
  $("#image-upload-btn").css({ 'display': 'none' });
  board = null;
  handleFileSelect(evt);
  setTimeout(function(){ setImageEditor(); }, 20);
});


// Completely new scripts
$('#search-tags').dropdown({
  maxSelections: 3,
  minCharacters: 2,
  onChange: searchTagsChanged
});

function searchTagsChanged(){
  var raw_tags = $('#search-tags').val();
  var tags = [];
  $.each(raw_tags, function(i, val){
    tags.push(parseInt(val));
  });
  console.log(tags);
  console.log("exe");
  getImagesWithTags(tags).then(function(data){
    console.log("exe got");
    all_images = data
    current_images = data.slice(0,9);
    changePagination(1, Math.ceil(data.length/9));
    processMapChanges();

  }, function(err){
    alertErr("Cannot connect to Ethereum Network!");
  });
}

$('#tags-selector-upload').dropdown({
  maxSelections: 5,
  minCharacters: 2
});

semantic = {};
// ready event
semantic.ready = function() {

  // selector cache
  var $buttons = $('.ui.buttons .button'),
    $toggle  = $('.main .ui.toggle.s-query'),
    $button  = $('.ui.button').not($buttons).not($toggle),
    handler = {
      activate: function() {
        $(this).addClass('active-selected').siblings().removeClass('active-selected');
        var option = $(this).attr('search-data');
        if (option == "location") {
          $("#tags-input").css({'display':'none'});
          $("#location-input").css({'display':'inherit'});
        } else {
          $("#location-input").css({'display':'none'});
          $("#tags-input").css({'display':'inherit'});
        }
      }

    }
  ;

  $buttons.on('click', handler.activate);
};

disable_map_event=false;

function switchToTagView(){
  // old_center = center_map.getCenter();
  // old_zoom = center_map.getZoom();
  disable_map_event = true;
  // center_map.map.setOptions({
  //   draggable: false,
  //   scrollwheel: false,
  //   panControl: false,
  //   maxZoom: 5,
  //   minZoom: 5,
  //   zoom: 5,
  //   // center: latlng,
  // });
  setTimeout(function(){
    // $('#search-tags').trigger('change');
    searchTagsChanged();
  }, 10);
}
function switchToLocationView(){
  disable_map_event = false;
  // center_map.map.setOptions({
  //   draggable: true,
  //   scrollwheel: true,
  //   panControl: true,
  //   maxZoom: 20,
  //   minZoom: 1,
  // });
  // center_map.setZoom(old_zoom);
  // center_map.map.setCenter(old_center);
}

// attach ready event
$(document).ready(semantic.ready);
$(document)
  .ready(function() {
    $('.ui.menu .ui.dropdown').dropdown({
      on: 'hover'
    });
    $('.ui.menu a.item')
      .on('click', function() {
        $(this)
          .addClass('active')
          .siblings()
          .removeClass('active')
        ;
      })
    ;
  })
;
var upload_state = "first";

// Initiate Tabs: Navigate by clicking on steps
// $('.upload-tab-btn').tab();
$(".upload-tab-btn").on('click', function(){
  upload_state = $(this).attr('data-tab');
  gotoTab(upload_state);
});

var first_open = true;
var slider;
$("#my-photos-btn").on('click', function(){
  if (typeof myimages === 'undefined' || myimages.length <= 0) {
    alertErr("No images found!", "You have not uploaded any photos");
  } else {
    $('#my-photos-modal').modal('show');
    if (first_open) {
      slider = $('.fotorama').fotorama();
      first_open=false;
    }
    $('#my-photos-modal').modal('refresh');
  }
});

$("#upload-btn").on('click', function(){
  $('#upload-photo-modal').modal('show');
});

$("#upload-cancel-btn").on('click', function(){
  gotoTab("first");
  $("#image-wrapper span").remove();
  $("#image-upload-btn").css({ 'display': 'initial' });
  $('#upload-photo-modal').modal('hide');
  $("#image-upload").val('');
  setNextButtonText("next");
  $(".upload-tab-btn").removeClass('completed');
  $("#upload-second-tb").addClass('disabled');
  $("#upload-third-tb").addClass('disabled');
});

// Upload Box
// Upload Box Step buttons click listener
/*$(".upload-tab-btn").on('click', function(){
  $.tab('change tab', 'tab-name');
});*/

// Next button Click listener
$("#upload-next-btn").on('click', function(){
  upload_state = $(".upload-tab-btn.active").attr("data-tab");
  if( $("#image-upload").get(0).files.length === 0 ) {
    gotoTab("first");
    showUploadBoxError("Please select an image");

  }
  else if ($('.darkroom-toolbar').length==1){
    alertErr("Please save the image first", '');
    gotoTab("first");
  }
  else if (upload_state == "first") {
    gotoTab("second");
    initUploadMap();
    if (image_latitude!=undefined && image_longitude!=undefined){
      upload_map.setCenter(image_latitude, image_longitude);
    }
    $("#upload-first-tb").addClass('completed');
    $("#upload-second-tb").removeClass('disabled');

  }
  else if (upload_state == "second") {
    if (isSecondFormValid() === true) {
      setThirdTabDetails();
      setNextButtonText("upload");
      $("#upload-second-tb").addClass('completed');
      $("#upload-third-tb").removeClass('disabled');
      gotoTab("third");
    }
  }
  else if(upload_state == "third") {
    if (isSecondFormValid() === true) {
      $("#upload-third-tb").addClass('completed');
      handleUploadImage();
    }

  } else showUploadBoxError("Please try again!");
});

function handleUploadImage() {
  /*image_caption, image_location, image_tags <array>, image_latitude, image_longitude, getImageDataURL() <Imags's data URL>
  is available here*/

  $("#upload-next-btn").addClass('disabled loading');
  addImage(document.getElementById('final-image'), image_caption, image_latitude, image_longitude, image_tags).then(function(data){
      $("#upload-next-btn").removeClass('disabled loading');
      // TODO Change here for after success events
      alert("Image Successfully Uploaded!", "The image has been successfully uploaded.");
      $("#upload-cancel-btn").trigger("click");
      google.maps.event.trigger(center_map.map, 'bounds_changed');

      slider.push({img: getUrl(data.hash)});

  }, function (err){
      $("#upload-next-btn").removeClass('disabled loading');
      // TODO Change here for after err events
      alertErr('Error in Uploading Image', "Some problem with Ethereum network. Please Try Again.");
      $("#upload-cancel-btn").trigger("click");
  });

}

function isSecondFormValid() {
  image_caption = $("#image-caption-upload").val().trim();
  image_location = $('#image-location-upload').val().trim();
  image_tags = $("#tags-selector-upload").val();
  if (image_caption == "") {
    showUploadBoxError("Please fill in caption!");
    return false;
  }  else if (image_location == "") {
    showUploadBoxError("Please fill in location!");
    return false;
  } else if (image_tags.length == 0) {
    showUploadBoxError("Please select tags!");
    return false;
  } else {
    return true;
  }
}

function setThirdTabDetails() {
  $("#final-image").attr('src', getImageDataURL());
  $("#final-caption").text(image_caption);
  $("#final-location").text(image_location);
  $("#final-tags").empty();
  $.each(image_tags, function( index, value ) {
    $("#final-tags").append('<a class="ui tag label">'+tags[value-1]+'</a>');
  });
}

function changeToLiked(el){
  el
  .removeClass('outline')
  .removeAttr("onclick");
}

function changeToUnliked(el){
  el
  .addClass('outline')
  .attr("onclick", 'likeClicked(this);');
}

function likeClicked(element){
  var obj = $(element).parent().parent();
  var index = parseInt(obj.attr("value"));
  var likes = parseInt(obj.find('.extra.content > span').html(),10);
  likes = likes + 1;

  changeToLiked(obj.find('i'));

  Controller.upvoteImage(index).then(function(data){
    obj.find('.extra.content > span').html(likes);
  }, function (err){
    changeToUnliked(obj.find('i'));
    alertErr("Error Upvoting");
  })

}

function deleteClicked(element){
  var obj = $(element).parent().parent();
  var index = parseInt(obj.attr("value"));
  showDeleteModal(index);
}
function reportClicked(element){
  var obj = $(element).parent().parent();
  var index = parseInt(obj.attr("value"));
  showReportModal(index);
}

function updateImageInfo(jimage_obj, index){
  var data = images[index];
  // jimage_obj.find("img").attr('src', data[0]);
  jimage_obj.find('.center-crop-image')
    .css('background-image', 'url(' + data[0] + ')');

  jimage_obj.find('.header').html(data[1]);

  jimage_obj.find('.meta').html(username[data[6]]);

  jimage_obj.find('.extra.content > span').html(data[5].toNumber());
  jimage_obj.attr("value", index);

  if (isOwnerImage(index)){
    jimage_obj.find('i.like-button')
      .removeClass('heart')
      .removeClass('like')
      .addClass('trash')
      .attr('onclick', 'deleteClicked(this)');

    jimage_obj.find('i.report-button')
      .remove();
  }
  else {
    VotingList.isUpvoted(index, false).then(function(isUpvoted){
      if (isUpvoted) {
        changeToLiked(jimage_obj.find('i.like-button'));

      }
    }, function(err){
      alertErr("Cannot connect to Ethereum Network");
    });
  }
}


function refreshImages(hide_other_markers){

  // use current_images
    // var temp = $(current_images).not(shown_images).get();
  for (var i in current_images){
    var index = current_images[i];
    if ((index in images) && (images[index][6] in username)){
      if (index in images_dom){

        if (images_dom[index].hasClass('hidden')){
          images_dom[index].appendTo("#image-cards");
          images_dom[index].removeClass('hidden');
          // images_dom[index].transition('fly left');
        }
        // markers[index].setMap(center_map.map);

      } else {
        var dom = template_image.clone();
        images_dom[index] = dom;
        dom.appendTo("#image-cards");
        dom.removeClass("hidden");
        // dom.transition('fly left');
        updateImageInfo(dom, index);
      }
    }
  }

  var toHide = $(shown_images).not(current_images).get();
  for (var i in toHide){
    var index = toHide[i];
    if (index in images_dom){
      images_dom[index].addClass('hidden');
      if (hide_other_markers)
        markers[index].setMap(null);
    }
    // images_dom[index].transition('fly left');
  }
  shown_images = current_images;
  // loop over indexes
  //   check if image exists in loaded_images
        // check if dom created
  //     if yes then show image if not shown
  //    else create image dom and show
  // hide other images
}


function processMapChanges(){
  refreshImages();
  $.each(current_images, function(i, id){
    if (!(id in markers)){
      getImage(id).then(function(data){
        images[id] = data;
        if (!(id in markers)){
          markers[id] = center_map.addMarker({
            lat: data[2],
            lng: data[3],
            icon: '../images/logo32.png'
          });

          markers[id].addListener('click', bounceImageCard.bind(this, id));

          cluster.addMarker(markers[id]);
          if (data[6] in username){
            refreshImages();
          } else {
            UserList.getUserInfo(data[6]).then(function(name){
              var name = toAscii(name[0]);
              username[data[6]] = name;
              refreshImages();
            }, function(err){
              alertInfo("Cannot load usernames");
            });
          }
        }
      });
    }
  });
}


// TODO show markers only to the results;
isExecuting = false;
lastCall = null;

function initCenterMap(){

  center_map = new GMaps({
      el: '#map-first',
      lat: 22.3145,
      lng: 87.3091,
      styles: map_styles,
      bounds_changed: function(e){
        if (disable_map_event) return;
        if (isExecuting){
          // isExecuting=true;
          clearTimeout(lastCall);
        }

        lastCall = setTimeout(function(){
          var b = center_map.getBounds();
          var map = center_map.map;
          var r = Math.max((b.b.f-b.b.b)/2, (b.f.f-b.f.b)/2);
          var p  = getImagesWithLatLong(e.center.lat(), e.center.lng(), r)
          console.log("exe");
          p.then(function(data){
            console.log("exe got");
            all_images = data
            current_images = data.slice(0,9);
            changePagination(1, Math.ceil(data.length/9));
            processMapChanges();

          }, function(err){
            alertErr("Cannot connect to Ethereum Network!");
          })
          isExecuting=false;
        }, 1000);
        isExecuting = true;
        // console.log(e.center.lat());
        // console.log(e.center.lng());
      }
  });

  center_map.setOptions({ minZoom: 5, maxZoom: 20 });

  var options = {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    minimumClusterSize: min_cluster_size
  }

  cluster =  new MarkerClusterer(center_map.map, markers, options);
  google.maps.event.addListener(cluster, 'clusterclick', function(cluster) {
      for (var i=0;i<cluster.markers_.length;i++){
        new google.maps.event.trigger(cluster.markers_[i] , 'click' );
      }
  });

  var center = center_map.getCenter();
  marker_center = center_map.addMarker({
    lat: center.lat(),
    lng: center.lng()
  });

  GMaps.geolocate({
    success: function(position) {
      center_map.setCenter(position.coords.latitude, position.coords.longitude);
      marker_center.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      center_map.setZoom(15);
    },
    error: function(error) {
      alertErr('Geolocation failed: '+error.message);
    },
    not_supported: function() {
      alertInfo("Your browser does not support geolocation");
    },
    always: function() {
    }
  });

  // TODO Add set coordinates and open modal
  center_map.setContextMenu({
      control: 'map',
      options: [{
          title: 'Add Image',
          name: 'add_image',
          action: function (e) {
              this.addMarker({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                  title: 'New Marker',
                  infoWindow: {
                      content: '<p>Add Picture</p>'
                  }
              });
          }
      }]
  });

  var input = (document).getElementById('search-location');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', center_map);


  autocomplete.addListener('place_changed', function() {

    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      alertInfo("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      center_map.fitBounds(place.geometry.viewport);
    } else {
      center_map.setCenter(place.geometry.location);
      center_map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker_center.setPosition(place.geometry.location);


  });


  return center_map;
}

function initMap() {
    initCenterMap();
}

function initUploadMap() {
  upload_map = new GMaps({
      el: '#map-second',
      lat: 20.5937,
      lng: 78.9629
  });

  var center = upload_map.getCenter();
  marker_upload = upload_map.addMarker({
    lat: center.lat(),
    lng: center.lng()
  })

  GMaps.geolocate({
    success: function(position) {
      upload_map.setCenter(position.coords.latitude, position.coords.longitude);
      marker_upload.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    },
    error: function(error) {
      alertInfo('Geolocation failed: '+error.message);
    },
    not_supported: function() {
      alertInfo("Your browser does not support geolocation");
    },
    always: function() {
    }
  });

  var upload_input = (document).getElementById('image-location-upload');
  var autocomplete_upload = new google.maps.places.Autocomplete(upload_input);

  autocomplete_upload.bindTo('bounds', upload_map);



  autocomplete_upload.addListener('place_changed', function() {

    var place = autocomplete_upload.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      upload_map.fitBounds(place.geometry.viewport);
    } else {
      upload_map.setCenter(place.geometry.location);
      upload_map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker_upload.setPosition(place.geometry.location);
    image_latitude = place.geometry.location.lat();
    image_longitude = place.geometry.location.lng();

  });


}

function gotoTab(name) {
  $.tab('change tab', name);
  $("#tab-menu-upload .upload-tab-btn.active").removeClass('active');
  $("#upload-"+name+"-tb").addClass('active');
  upload_state = name;
}

function showUploadBoxError(error_msg) {
  var elem = $("#upload-box-err");
  elem.html(error_msg);
  elem.fadeIn('fast');
  setTimeout(function(){
  elem.fadeOut('fast');
  }, 3000);
}

function setNextButtonText(state) {
  if (state == "next")
    $("#upload-next-btn").html("Next &nbsp; <i class='long arrow right icon'></i>");
  else if(state=="upload")
    $("#upload-next-btn").html("Upload &nbsp; <i class='upload icon'></i>");
}

// Main Search Bar handle
$("#main-search-btn").on('click', function(){
  var search_param = $(".s-query.active-selected").attr("search-data");
  if(search_param == "location") {
    var location_search = $("#search-location").val().trim();
  } else if (search_param == "tags") {
    var tags_search = $("#search-tags").val();

  }
});

// Settings Button triggers
$('#settings-gear').dropdown();
function showRewardModal() {
  $("#reward-modal").modal('show');
}

function showAboutModal() {
    $("#about-modal").modal('show');
}

function showSettingsModal() {
    $("#settings-modal").modal('show');
}

function showDeleteModal(index){
  $('#delete-image-modal > div.image.content > div.ui.medium.image > img')
    .attr('src', images[index][0]);
  $('#delete-image-modal > div.actions > div.ui.positive.right.labeled.icon.button')
    .attr('onclick', 'deleteImage('+index+')');
  $('#delete-image-modal').modal('show');
}
function showReportModal(index){
  $('#report-image-modal > div.image.content > div.ui.medium.image > img')
    .attr('src', images[index][0]);
  $('#report-image-modal > div.actions > div.ui.positive.right.labeled.icon.button')
    .attr('onclick', 'reportImage('+index+')');
  $('#report-image-modal').modal('show');
}

function deleteImage(index){
  Controller.deleteImage(index).then(function(){
    alert("Image Deleted Successfully", 'The image has been successfully removed from Ethereum network');
    markers[index].setMap(null);
    delete markers[index];
    google.maps.event.trigger(center_map.map, 'bounds_changed');
  }, function(err){
    alertErr("Error deleting image!", '');
  })
}
function reportImage(index){
  Controller.reportImage(index).then(function(){
    alert("Image Reported Successfully", 'The image has been reported on Ethereum network');
  }, function(err){
    alertErr("Error reproting image!", '');
  })
}

//Individual image modal
$("#image-cards").on('click', ".card", function(){
  var index = parseInt($(this).attr('value'));
  console.log(index);
  var img_src = images[index][0];
  $("#photo-modal-image").attr('src', img_src);
  $('#single-image-modal').modal('show');
});

// Progress Bar
// Anywhere :: NProgress.start() and NProgress.done() and NProgress.inc()
NProgress.configure({ minimum: 0.2, showSpinner: false, trickleSpeed: 50, speed: 800 });


$("#set-ipfs").on('click', function(){
    var current_ipfs = $("#ipfs-data").val().trim();
});

$("#set-rpc").on('click', function(){
    var current_rpc = $("#rpc-data").val().trim();
});
