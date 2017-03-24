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
$('.upload-tab-btn').tab();

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
  $("#upload-next-btn").html("Next &nbsp; <i class='long arrow right icon'></i>");
  $(".upload-tab-btn").removeClass('completed');
});

// Upload Box
// Upload Box Step buttons click listener
/*$(".upload-tab-btn").on('click', function(){
  $.tab('change tab', 'tab-name');
});*/

google.maps.event.addDomListener(window, 'load', get_suggestion_upload);
// Next button Click listener
$("#upload-next-btn").on('click', function(){
  if( $("#image-upload").get(0).files.length === 0 ) {
    gotoTab("first");
    showUploadBoxError("Please select an image");

  } else if (upload_state == "first") { 
    gotoTab("second");
    setUploadBoxMap();
    $("#upload-first-tb").addClass('completed');

  } else if (upload_state == "second") { 
    if (isSecondFormValid() === true) {
      setThirdTabDetails();
      $(this).html("Upload &nbsp; <i class='upload icon'></i>");
      $("#upload-second-tb").addClass('completed');
      gotoTab("third");
    }
  } else if(upload_state == "third") {
    $("#upload-third-tb").addClass('completed');
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

function get_suggestion() {
    var input = (document).getElementById('search-location');
    var autocomplete = new google.maps.places.Autocomplete(input);
}
function setCentreMap() {
  center_map = new GMaps({
      el: '#map-first',
      lat: 22.3139,
      lng: 87.31
  });
  
  center_map.setContextMenu({
      control: 'center_map',
      options: [{
          title: 'Add marker',
          name: 'add_marker',
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
  
  
  
  google.maps.event.addDomListener(window, 'load', get_suggestion);
  $('#search-location').on('blur', function (e) {
      e.preventDefault();
      GMaps.geocode({
          address: $('#search-location').val().trim(),
          callback: function (results, status) {
              if (status == 'OK') {
                  var latlng = results[0].geometry.location;
                  center_map.setCenter(latlng.lat(), latlng.lng());
                  center_map.addMarker({
                      lat: latlng.lat(),
                      lng: latlng.lng()
                  });
              }
          }
      });
  });
}

function get_suggestion_upload() {
    var upload_input = (document).getElementById('image-location-upload');
    var autocomplete_upload = new google.maps.places.Autocomplete(upload_input);
}

function setUploadBoxMap() {
  upload_map = new GMaps({
      el: '#map-second',
      lat: 22.3139,
      lng: 87.31
  });
  upload_map.setContextMenu({
      control: 'upload_map',
      options: [{
          title: 'Add marker',
          name: 'add_marker',
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
  
  $('#image-location-upload').on('blur', function (e) {
      e.preventDefault();
      GMaps.geocode({
          address: $('#image-location-upload').val().trim(),
          callback: function (results, status) {
              if (status == 'OK') {
                  var latlng = results[0].geometry.location;
                  image_latitude = latlng.lat();
                  image_longitude = latlng.lng();
                  upload_map.setCenter(latlng.lat(), latlng.lng());
                  upload_map.addMarker({
                      lat: latlng.lat(),
                      lng: latlng.lng()
                  });
              }
          }
      });
  });

  // Trigger autocomplete
  get_suggestion_upload();
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

// Settings Button triggers
$('#settings-gear').dropdown();
function showRewardModal() {
  $("#reward-modal").modal('show');
}