webapp.service('fileUploadService', [ '$rootScope', '$q', '$resource', 'StaticVariable', FileUploadService ]);

function FileUploadService($rootScope, $q, $resource, StaticVariable) {
	var requests = [];
	var svc = {
		post : function(files, data, progressCb) {
			var xhr = new XMLHttpRequest();
			requests.push(xhr);
			return {
				to : function(uploadUrl) {
					var deferred = $q.defer()
					if (!files || !files.length) {
						deferred.reject("No files to upload");
						return;
          }

          // CORS 문제 발생
          // xhr.withCredentials = true;
          xhr.upload.onprogress = onProgress;
          xhr.onload = onLoad;
          xhr.upload.onerror = onError;

          var formData = new FormData();

          if (data) {
            Object.keys(data).forEach(function(key) {
              formData.append(key, data[key]);
            });
          }

          for (var idx = 0; idx < files.length; idx++) {
            formData.append(files[idx].name, files[idx]);
          }

          xhr.open("POST", uploadUrl);
          xhr.send(formData);

          function onProgress(e) {
            $rootScope.safeApply(function() {
              var percentCompleted;
              if (e.lengthComputable) {
                percentCompleted = Math.round((e.loaded / e.total) * 100);
                if (progressCb) {
                  progressCb(percentCompleted);
                } else if (deferred.notify) {
                  deferred.notify(percentCompleted);
                }
              }
            });
          }

          function onLoad(e) {
            var idx = -1;
            angular.forEach(requests, function(val, key) {
              if (val == xhr) {
                idx = key;
              }
            });
            if (idx != -1) {
              requests.splice(idx, 1);
            }
            $rootScope.safeApply(function() {
              var ret = {
                files: files,
                data: angular.fromJson(xhr.responseText)
              };
              deferred.resolve(ret);
            });
          }

          function onError(e) {
            var msg = xhr.responseText? xhr.responseText : "An unknown error occurred posting to '" + uploadUrl + "'";
            $rootScope.safeApply(function() {
              deferred.reject(msg);
            });
          }

					return deferred.promise;
				},
				about: function(){
					if(requests){
						angular.forEach(requests, function(req){
							req.abort();
						});
					}
				}
			};
		},
		attachFileDelete : function(){
			return $resource(StaticVariable.getUrl('/attach/delete/:typeId/:attachId?userkey='+$rootScope.gVariable.userKey),
				{
					typeId : '@typeId',
					attachId : '@attachId'
				},
				StaticVariable.getRequestActions.defaultAction());
		},
		attachFileDelete : function(){
			return $resource(StaticVariable.getUrl('/attach/temp/:attachId/delete.do?userkey='+$rootScope.gVariable.userKey),
				{
					attachId : '@attachId',
				},
				StaticVariable.getRequestActions.defaultAction());
		},
	};

	return svc;
};
