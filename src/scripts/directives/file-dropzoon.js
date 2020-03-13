(function () {
  "use strict";
  webapp.directive('fileDropzone', function() {
  return {
    restrict: 'A',
    scope: {
      file: '=',
      fileName: '='
    },
    link: function(scope, element, attrs) {
      var checkSize,
          isTypeValid,
          processDragOverOrEnter,
          validMimeTypes;

      processDragOverOrEnter = function (event) {
        if (event != null) {
          event.preventDefault();
        }
        if(enableUploadComponent()) {
          var $obj = $(".dhx-dropable-area.drop-files-here");
          if($obj.length == 0) $obj = $(".dhx-files-block.dhx-webkit-scroll");
          if( $obj.length > 0) {
            $obj.closest(".layout_y").addClass('dhx-dragin');
          }
        }
        return false;
      };

      validMimeTypes = attrs.fileDropzone;
      element.bind('dragover', processDragOverOrEnter);
      element.bind('dragenter', processDragOverOrEnter);
      element.hover(function(){

      }, function(){
        var $obj = $(".dhx-dropable-area.drop-files-here");
        $obj.closest(".layout_y").removeClass('dhx-dragin');
      });
      

      return element.bind('drop', function(event) {
        console.log("drop")

        return false;
      });
    }
  };
})
}());
