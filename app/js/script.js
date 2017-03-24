// All variables
var board = null;
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
          console.log(imageObj);
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

// Initiate Tabs: Navigate by clicking on steps
// $('.upload-tab-btn').tab();

$("#my-photos-btn").on('click', function(){
  $('#my-photos-modal').modal('show');
});

var upload_state = "first";

$("#upload-btn").on('click', function(){
  $('#upload-photo-modal').modal('show');
});

$("#upload-cancel-btn").on('click', function(){
  gotoTab("first");
  $("#image-wrapper span").remove();
  $("#image-upload-btn").css({ 'display': 'initial' });
  $('#upload-photo-modal').modal('hide');
  $("#image-upload").val('');
});

// Upload Box
// Upload Box Step buttons click listener
/*$(".upload-tab-btn").on('click', function(){
  $.tab('change tab', 'tab-name');
});*/

// Next button Click listener
$("#upload-next-btn").on('click', function(){
  if( $("#image-upload").get(0).files.length === 0 ) {
    gotoTab("first");
    showUploadBoxError("Please select an image");

  } else if (upload_state == "first") {
    gotoTab("second");
    initUploadMap();

  } else if (upload_state == "second") {
    if (isSecondFormValid() === true) {
      setThirdTabDetails();
      $(this).html("Upload &nbsp; <i class='upload icon'></i>")
      gotoTab("third");
    }
  } else if(upload_state == "third") {
    handleUploadImage();

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


function initCenterMap(){
  center_map = new GMaps({
      el: '#map-first',
      lat: 22.3139,
      lng: 87.31
  });

  GMaps.geolocate({
    success: function(position) {
      center_map.setCenter(position.coords.latitude, position.coords.longitude);
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

  // TODO Add image from here
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


  var center = center_map.getCenter();
  var marker = center_map.addMarker({
    lat: center.lat(),
    lng: center.lng()
  })

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
    marker.setPosition(place.geometry.location);


  });


  return center_map;
}

function initMap() {
    initCenterMap();
}

function initUploadMap() {
  upload_map = new GMaps({
      el: '#map-second',
      lat: 22.3139,
      lng: 87.31
  });

  GMaps.geolocate({
    success: function(position) {
      upload_map.setCenter(position.coords.latitude, position.coords.longitude);
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


  var center = upload_map.getCenter();
  var marker2 = upload_map.addMarker({
    lat: center.lat(),
    lng: center.lng()
  })

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
    marker2.setPosition(place.geometry.location);
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

// Main Search Bar handle
$("#main-search-btn").on('click', function(){
  var search_param = $(".s-query.active-selected").attr("search-data");
  if(search_param == "location") {
    var location_search = $("#search-location").val().trim();
  } else if (search_param == "tags") {
    var tags_search = $("#search-tags").val();

  }
});
