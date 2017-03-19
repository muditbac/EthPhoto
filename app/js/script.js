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
