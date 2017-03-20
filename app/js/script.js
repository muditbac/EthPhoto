var board = null;
$(document).ready(function(){
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
      maxHeight: 500,
      ratio: 4/3,
      backgroundColor: '#000',

      // Plugins options
      plugins: {
        // save: false,
        crop: {
          quickCropKey: 67, //key "c"
          //minHeight: 50,
          //minWidth: 50,
          //ratio: 4/3
        }
      },

      // Post initialize script
      initialize: function() {
        var cropPlugin = this.plugins['crop'];
        // cropPlugin.selectZone(170, 25, 300, 300);
        // cropPlugin.requireFocus();
      },
      save: {
        callback: function() {
            this.darkroom.selfDestroy(); // Cleanup
            var newImage = board.canvas.toDataURL();
            // fileStorageLocation = newImage;
            imageObj = newImage;
            console.log(imageObj);
          }
      }
    });
  }

  $("#image-upload").on('change', function(evt){
    board = null;
    $("#image-wrapper span").remove();
    handleFileSelect(evt);
    setTimeout(function(){ setImageEditor() }, 300);
  });
});

// Completely new scripts
$('#tags-selector').dropdown({
  maxSelections: 2
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
        $(this).addClass('active').siblings().removeClass('active');
        var a = $(this).attr('search-data');
        console.log(a);
        if (a == "location") { 
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

// Initiate Tabs
$('.upload-tab-btn').tab();

$("#my-photos-btn").on('click', function(){
  $('#my-photos-modal').modal('show');
});

$("#upload-btn").on('click', function(){
  $('#upload-photo-modal').modal('show');
});

$(".upload-tab-btn").on('click', function(){
  var tname = $(this).attr('data-tab');
  $.tab('change tab', 'tab-name');
});