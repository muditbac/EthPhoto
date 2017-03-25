// All variables
var board = null;
var markers = {};
var images = {};
var myimages = {};
var images_dom = {};
var template_image = $("#image-cards > div");
var shown_images = [];
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
  getMyImages().then(function(data){
    $.each(data, function(i, id){
      if (!(id in myimages)){
        getImage(id).then(function(data){
          myimages[id] = data;
        });
      }
    });
  }, function(err){
    alert("Cannot Load My Images");
  })
})

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
  maxSelections: 2
});

// Completely new scripts
$('#tags-selector-upload').dropdown({
  maxSelections: 5
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

$("#my-photos-btn").on('click', function(){
  $('#my-photos-modal').modal('show');
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

  } else if (upload_state == "first") {
    gotoTab("second");
    initUploadMap();
    if (image_latitude!=undefined && image_longitude!=undefined){
      upload_map.setCenter(image_latitude, image_longitude);
    }
    $("#upload-first-tb").addClass('completed');
    $("#upload-second-tb").removeClass('disabled');

  } else if (upload_state == "second") {
    if (isSecondFormValid() === true) {
      setThirdTabDetails();
      setNextButtonText("upload");
      $("#upload-second-tb").addClass('completed');
      $("#upload-third-tb").removeClass('disabled');
      gotoTab("third");
    }
  } else if(upload_state == "third") {
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
  addImage(document.getElementById('final-image'), image_caption, image_latitude, image_longitude, image_tags).then(function(){
      $("#upload-next-btn").removeClass('disabled loading');
      // TODO Change here for after success events
      alert("Image Uploaded");
      $("#upload-cancel-btn").trigger("click");
  }, function (err){
      $("#upload-next-btn").removeClass('disabled loading');
      // TODO Change here for after err events
      alert('Error');
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

function updateImageInfo(jimage_obj, data){
  jimage_obj.find("img").attr('src', data[0]);
}

function refreshImages(){
  // use current_images
    // var temp = $(current_images).not(shown_images).get();
  for (var i in current_images){
    var index = current_images[i];
    if (index in images){
      if (index in images_dom){

        if (images_dom[index].hasClass('hidden')){
          images_dom[index].appendTo("#image-cards");
          // images_dom[index].removeClass('hidden');
          images_dom[index].transition('swing up');
        }

      } else {
        console.log("Here");
        var dom = template_image.clone();
        images_dom[index] = dom;
        dom.appendTo("#image-cards");
        // dom.removeClass("hidden");
        dom.transition('swing up');
        updateImageInfo(dom, images[index]);
      }
    }
  }

  var toHide = $(shown_images).not(current_images).get();
  for (var i in toHide){
    var index = toHide[i];
    // images_dom[index].addClass('hidden');
    images_dom[index].transition('swing up');
  }
  shown_images = current_images;
  // loop over indexes
  //   check if image exists in loaded_images
        // check if dom created
  //     if yes then show image if not shown
  //    else create image dom and show
  // hide other images
}

function initCenterMap(){

  center_map = new GMaps({
      el: '#map-first',
      lat: 20.5937,
      lng: 78.9629,
      idle: function(e){
        var b = center_map.getBounds();
        var r = Math.max((b.b.f-b.b.b)/2, (b.f.f-b.f.b)/2);
        var p  = getImagesWithLatLong(e.center.lat(), e.center.lng(), r)
        p.then(function(data){
          current_images = data;
          refreshImages();
          $.each(data, function(i, id){
            if (!(id in markers)){
              getImage(id).then(function(data){
                images[id] = data;
                if (!(id in markers)){
                  markers[id] = center_map.addMarker({
                    lat: data[2],
                    lng: data[3],
                  });
                  cluster.addMarker(markers[id]);
                  refreshImages();
                }
              });
            }
          })
        }, function(err){
          alert("Cannot connect to Ethereum Network!");
        })
        // console.log(e.center.lat());
        // console.log(e.center.lng());
      }
  });

  // center_map.setOptions({ minZoom: 10, maxZoom: 20 });

  cluster =  new MarkerClusterer(center_map.map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})

  var center = center_map.getCenter();
  marker_center = center_map.addMarker({
    lat: center.lat(),
    lng: center.lng()
  })

  GMaps.geolocate({
    success: function(position) {
      center_map.setCenter(position.coords.latitude, position.coords.longitude);
      marker_center.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      center_map.setZoom(15);
    },
    error: function(error) {
      console.log('Geolocation failed: '+error.message);
    },
    not_supported: function() {
      console.log("Your browser does not support geolocation");
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
      window.alert("No details available for input: '" + place.name + "'");
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
      console.log('Geolocation failed: '+error.message);
    },
    not_supported: function() {
      console.log("Your browser does not support geolocation");
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
