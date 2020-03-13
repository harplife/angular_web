webapp.controller('PhotoUploaderCtrl', [ '$scope', '$element', '$compile', '$timeout', 'StaticVariable', 'fileUploadService', 'uuidFactory', '$rootScope',
    function PhotoUploaderCtrl($scope, $element, $compile, $timeout, StaticVariable, fileUploadService, uuid, $rootScope) {
      var vm = this;
      var addLine = '';
      var request;

      vm.showLoading = false;
      vm.onDelete = onDelete;
      vm.onDeleteCancel = onDeleteCancel;
      vm.loadingPosition = "";
      vm.fileData = new Array();
      var id = 0;

      vm.onChangeHandler = function(files) {
        console.log('onChangeHandler');
        vm.uploadFiles(files);
      };

      $scope.$on('cancelFileSend', function(event, args) {
        if (request) {
          request.about();
        }
      });

      vm.uploadFiles = uploadFiles;

      function uploadFiles(files) {
        console.log('uploadFiles', vm.fileData);
        var tempIds = [];
        // $scope.$root.safeApply 이 함수를 통해 model을 set해주지 않으면 실시간 갱신이 안되는 문제가 있다.
        $scope.$root.safeApply(function() {
          var hasZeroByteFile = false;
          angular.forEach(files, function(value) {
            if (value.size == 0) {
              hasZeroByteFile = true;
            } else {
              var obj = {
                isLoaded : false,
                fileName : value.name,
                size : value.size,
                id : id,
                delState : ''
              };
              tempIds.push(obj);
              if (vm.fileData == null)
                vm.fileData = new Array();
              vm.fileData.push(angular.copy(obj));
              id++;
            }
          });
          console.log("fu", vm.fileData);
          if (hasZeroByteFile) {
            alert('빈 파일이 있습니다.');
            return;
          }

          request = fileUploadService.post(files, null, function(percent) {
            // -- 진행율 표시
            angular.forEach(tempIds, function(obj) {
              console.log('progress percent::', percent);
              $('#filectl_' + obj.id + ' .progress .progress-bar').css('width', percent + '%');
            });
            if (percent == 100) {
              vm.showLoading = true;
            }
          });

          try {
            request.to(StaticVariable.getUrl('/attach/temp/upload.do?userkey='+$rootScope.gVariable.userKey)).then(function(value) {
              angular.forEach(value.data.responseVO.body.docs, function(item) {
                angular.forEach(vm.fileData, function(obj) {
                  if (item.fileName == obj.fileName && item.size == obj.size) {
                    obj.isLoaded = true;
                    obj.tmpFileKey = item.tmpFileKey;
                    obj.typeId = item.typeId;
                    obj.path = item.path;
                    obj.link = StaticVariable.getUrl("/attach/temp/" + item.tmpFileKey + "/download.do?fileName=" + item.encFileName);
                    obj.delState = '';
                    console.log(obj.link);
                  }
                });
              });
              // 올린 파일에 대해서는 Html의 file element가 가지고 있는 파일의 내용을 지워준다.
              angular.element(vm.fileElement).val(null);
              if (vm.callback) {
                vm.callback.onFileUploadComplete();
              }
              vm.showLoading = false;
            }, function(reason) {
              console.log(reason);
            });
          } catch (err) {
            console.log(err);
          }
        });
      }
      ;

      function onDelete(obj) {
        if (obj.typeId != "temp") {
          if (obj.delState != 'delete')
            obj.delState = 'delete';
          else
            obj.delState = '';
          return;
        }

        var idx = -1;
        angular.forEach(vm.fileData, function(val, key) {
          if (val == obj) {
            idx = key;
            return;
          }
        });

        if (idx != -1) {
          if (vm.fileData[idx].typeId == "temp") {
            var prms = fileUploadService.attachFileDelete().get({
              attachId : vm.fileData[idx].fileKey
            }).$promise;

            prms.then(function(data) {
              console.log('success', data);
            }, function(error) {
              console.error('fail', error);
            })
            vm.fileData.splice(idx, 1);
          } else {
            vm.fileData[idx].delState = 'delete';
            // if (vm.callback)
            // vm.callback.onFileDelete(vm.fileData[idx]);
          }
        }
      }
      ;

      function onDeleteCancel(obj) {
        var idx = -1;
        angular.forEach(vm.fileData, function(val, key) {
          if (val == obj) {
            idx = key;
            return;
          }
        });

        if (idx != -1) {
          vm.fileData[idx].delState = '';
          /*			if (vm.fileData[idx].typeId == "temp") {
          			var prms = fileUploadService.attachFileDelete().get({attachId:vm.fileData[idx].fileKey}).$promise;

          			prms.then(
          	                function (data) {
          	                	console.log('success', data);
          	                },
          	                function (error) {
          	                    console.error('fail', error);
          	                }
          	            )
          			} else if (vm.callback){
          				vm.callback.onFileDelete(vm.fileData[idx]);
          			}
          			vm.fileData.splice(idx, 1);\
           */
        }
      }
      ;

      vm.openDilalog = openDilalog;
      function openDilalog() {
        angular.element('#file-5').trigger("click");
      }

    } ]);
