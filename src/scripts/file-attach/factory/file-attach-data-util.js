webapp.factory('fileAttachDataUtil', function() {
	return {
		isLoading : function(arr) {
			if (arr) {
				var ret = false;
				angular.forEach(arr, function(value) {
					if (!value.isLoaded) {
						ret = true;
						return;
					}
				});
				return ret;
			} else {
				return ret;
			}
		},
		getTempFileKeys : function(arr) {
			var ret = [];
			if(arr){
				angular.forEach(arr, function(value) {
					if(value.tmpFileKey){
						ret.push(value.tmpFileKey);
					}
				});
			}
			return ret;
		},
		getAttachIds: function(arr){
			var ret = [];
			if(arr){
				angular.forEach(arr, function(value) {
					if(value.attachId){
						ret.push(value.attachId);
					}
				});
			}
			return ret;
		},
		cancel: function(scope){
			scope.$broadcast('cancelFileSend', {});
		}
	}
});
