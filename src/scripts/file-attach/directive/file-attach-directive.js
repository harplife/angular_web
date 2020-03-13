webapp.directive('fileAttach', ['$compile','$parse', function ($compile,$parse) {
    return {
    	transclude: true,
        restrict: 'E',
        scope:{
        	fileData:"=",
        	preFilesUpload:"=",
        	callback:"="
        },
        templateUrl: 'scripts/file-attach/directive/file-attach.html',
        controller: 'FileAttachController as faCtrl',
        link: function(scope, element, attrs, ctrl) {
        	var fileElement = angular.element(element[0].querySelector('input'));
        	fileElement.bind('change', function(){
        		ctrl.onChangeHandler(fileElement[0].files);
        	});

        	scope.$watchCollection('fileData', function(value) {
          	ctrl.fileData = scope.fileData;
          });

          if(scope.preFilesUpload && scope.preFilesUpload.length > 0){
            ctrl.uploadFiles(scope.preFilesUpload);
          }
          ctrl.callback = scope.callback;
          ctrl.fileElement = fileElement;

	        var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
	        processDragOverOrEnter = function(event) {
	          if (event != null) {
	            event.preventDefault();
	          }
	          event.dataTransfer.effectAllowed = 'copy';
	          return false;
	        };
	        validMimeTypes = attrs.fileDropzone;
	        checkSize = function(size) {
	          var _ref;
	          if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
	            return true;
	          } else {
	            alert("File must be smaller than " + attrs.maxFileSize + " MB");
	            return false;
	          }
	        };
	        isTypeValid = function(type) {
	          if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
	            return true;
	          } else {
	            alert("Invalid file type.  File must be one of following types " + validMimeTypes);
	            return false;
	          }
	        };
	        element.bind('dragover', processDragOverOrEnter);
	        element.bind('dragenter', processDragOverOrEnter);
	        return element.bind('drop', function(event) {
	          var file, name, reader, size, type;
	          if (event != null) {
	            event.preventDefault();
	          }
	          reader = new FileReader();
	          reader.onload = function(evt) {
	            if (checkSize(size) && isTypeValid(type)) {
	              return scope.$apply(function() {
	                scope.file = evt.target.result;
	                if (angular.isString(scope.fileName)) {
	                  return scope.fileName = name;
	                }
	              });
	            }
	          };
	          file = event.dataTransfer.files[0];
	          name = file.name;
	          type = file.type;
	          size = file.size;
	          reader.readAsDataURL(file);
	          return false;
	        });
        }
    };
}]);
