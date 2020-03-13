(function() {
  "use strict";
  /**
 * @ngdoc function
 * @name app.bbspost:h0102-detail-ctrl
 * @description # 게시판 조회 Controller of the 사용자정의 컬럼 게시판
 */
webapp.controller('H0103DetailCtrl', [ '$window', '$scope', '$location', '$state', '$stateParams', '$filter', 'GLOBAL_CONSTANT', 'StaticVariable', 'H0102APISrv', 'gAlert', 'gConfirm',
    'fileUploadService', 'postApi', 'customFieldApi', '$rootScope',

    /**
     * 게시판 - 조회화면 Control
     *
     * @param {object}
     *          $window - window object
     * @param {object}
     *          $scope - scope object
     * @param {object}
     *          $location - location object
     * @param {object}
     *          $state - state object
     * @param {object}
     *          $stateParams - state Parameter object
     * @param {object}
     *          CONSTANT - 전역 상수
     * @param {object}
     *          StaticVariable - StaticVariable object
     * @param {object}
     *          H0102APISvr - H0102APISvr Module
     * @param {object}
     *          gAlert - Alert Module
     * @param {object}
     *          gConfirm - Confirm Module
     * @param {object}
     *          fileUploadService - fileUploadService Module
     */
    function H0103DetailCtrl($window, $scope, $location, $state, $stateParams, $filter, CONSTANT, StaticVariable, h0102Api, gAlert, gConfirm, fileUploadService, postApi, customFieldApi, $rootScope) {
      // View Model
      var vm = this;

      $scope.visbile = true;
      $scope.visbile2 = false;
      $scope.visbile3 = false;
      $scope.visbile4 = false;
      $scope.visbile5 = false;
      $scope.visbile6 = false;

      vm.srch = {};
      // 페이징
      if ($stateParams.srch) {
        vm.srch = JSON.parse(decodeURIComponent($stateParams.srch));
      }

      if (vm.srch.layout == null)
        vm.layout = 'N';
      else
        vm.layout = vm.srch.layout;

      if ($stateParams.BbsPostId) {
        vm.srch.BbsPostId = $stateParams.BbsPostId;
      }

      vm.srchDetail = {};
      angular.copy(vm.srch, vm.srchDetail);
      vm.srchDetail.uploadFileList = [];

      // 조회 데이터
      vm.data = {
        TableNm : vm.srchDetail.TableNm,
        BbsPostId : vm.srchDetail.BbsPostId,
      };

      console.log('vm.srchDetail=', vm.srchDetail);

      // 사용자정의 컬럼 폼
      vm.udcForm = {};

      // 사용자정의 컬럼 모델
      vm.udcModel = {};

      // 사용자정의 컬럼 데이터 타입
      vm.udcDataType = {};

      // 사용자정의 컬럼정보
      vm.udcColumns = [];

      // 사용자정의 컬럼 옵션
      vm.udcOptions = {
        formState : {
          horizontalLabelClass : '',
          horizontalFieldClass : '',
          readOnly : true
        }
      };

      // 사용자정의 컬럼 데이터
      vm.udcData = [];

      // 댓글
      vm.comment = {};

      // 댓글 조회 조건
      vm.srchReply = {
        BbsMasterId : vm.srch.BbsMasterId != '' ? vm.srch.BbsMasterId : 1,
        tableNm : vm.srch.tableNm !== null ? vm.srch.tableNm : 'bbspost',
        BbsPostId : vm.srch.BbsPostId,
        TableId : vm.srch.BbsPostId,
        viewSize : 100,
        LastId : 0,
      };
      // 옵션
      vm.items = [ {
        name : '공유',
        icon : 'zmdi zmdi-share'
      }, {
        name : '업로드',
        icon : 'zmdi zmdi-upload'
      }, {
        name : '복사',
        icon : 'zmdi zmdi-copy'
      }, {
        name : '현재 페이지 인쇄',
        icon : 'zmdi zmdi-print'
      }, ];

      // 업로드 파일 목록
      var fileUploadId = 0;
      vm.uploadFileList = [];
      vm.uploadFileListReply = [];

      /**
       * 사용자정의 컬럼 모델 설정
       *
       */
      function setUdcModel() {
        angular.forEach(Object.keys(vm.data), function(item) {
          // 사용자정의 컬럼 모델
          if (vm.udcModel[item] !== undefined) {
            if (vm.udcDataType[item] == '40') {
              vm.udcModel[item] = $filter('date')(vm.data[item],'yyyy-MM-dd');
            } else {
              vm.udcModel[item] = vm.data[item];
            }
          }
        });
      }

      /**
       * 1) 화면 표시 컬럼 목록 2) 사용자정의 컬럼 모델 정보 3) 사용자정의 컬럼 정보
       *
       * @param
       * @return
       */
      function getSelectViewColumns() {
        var data = vm.srchDetail;
        data.viewColumns = {};
        data.mapCode = 'MetaColumn.getSelectEditColumns';
        postApi.select(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              vm.allColumns = result.body.docs;

              angular.forEach(vm.allColumns, function(item) {

                // 화면 표시 컬럼 목록
                if (item.EditColumnShowYN === 'Y') {
                  vm.srchDetail.viewColumns[item.ColumnPhysicalNm] = true;
                }

                // 사용자정의 컬럼 모델 정보
                if (item.CustomColumnYN === 'Y') {
                  vm.udcModel[item.ColumnPhysicalNm] = '';
                  vm.udcDataType[item.ColumnPhysicalNm] = item.ColumnPhysicalDataType;
                }
              });

              // 사용자정의 컬럼 정보
              //setUdcColumns();
              vm.udcColumns = customFieldApi.setReadOnlyUdcColumns(vm.allColumns);

              // 데이터 조회
              getData();
            }
          }
        }, function(error) {
          console.table(error);
        });
      }

      /**
       * 조회수 증가
       *
       * @param
       * @return
       */
      function updateReadCnt() {
        //doUpdateReadCnt없ㅇ므
        var prms = h0102Api.doUpdateReadCnt().post(vm.srch).$promise;
      }

      /**
       * 첨부파일 목록 조회
       *
       * @param
       * @return
       */
      function getFileList() {

        var data = vm.srchDetail;
        data.viewColumns = {};
        data.mapCode = 'FileAttach.getFileList';
        postApi.select(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              var uploadFileList = [];

              angular.forEach(result.body.docs, function(item) {
                var obj = {
                  id : item.fileId,
                  isLoaded : true,
                  link : StaticVariable.getUrl('/attach/file/' + item.PhysicalFileNm + '/download.do?path=' + item.PhysicalPath + '&fileName=' + item.LogicalFileNm),
                  fileName : item.LogicalFileNm,
                  size : item.FileSize,
                  fileKey : item.PhysicalFileNm,
                  path : item.PhysicalPath,
                  downloadCnt : item.DownloadCnt,
                };
                uploadFileList.push(obj);
              });

              angular.copy(uploadFileList, vm.uploadFileList);

            }
          }
        },function(error) {
          console.table(error);
        });
      }
      /**
       * 데이터 조회
       *
       * @param
       * @return
       */
      function getData() {
        postApi.select('BbsPost.getBbsPostDetail', vm.srchDetail, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              vm.data = result.body.docs[0];

              // 사용자정의 컬럼 모델 적용
              if (vm.udcColumns.length > 0)
                setUdcModel();

              var uploadFileList = [];

              angular.forEach(vm.data.uploadFileList, function(item) {
                var obj = {
                  id : item.fileId,
                  isLoaded : true,
                  link : StaticVariable.getUrl('/attach/file/' + item.PhysicalFileNm + '/download.do?path=' + item.PhysicalPath + '&fileName=' + item.LogicalFileNm),
                  fileName : item.LogicalFileNm,
                  size : item.FileSize,
                  fileKey : item.PhysicalFileNm,
                  path : item.PhysicalPath,
                  downloadCnt : item.DownloadCnt,
                };
                uploadFileList.push(obj);
              });

              angular.copy(uploadFileList, vm.uploadFileList);

            }
          }
        }, function(error) {
          console.table(error);
        });
      }

      // 원본 이벤트
      var originatorEv;

      /**
       * 평점 표시
       *
       * @param {object}
       *          $mdOpenMenu - Open Menu Object
       * @param {object}
       *          ev - ev Object
       * @return
       */
      function openMenu($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
      }

      /**
       * 데이터 삭제
       *
       * @param
       * @return
       */
      function deleteData() {
        gConfirm('', 'Menu.DELETECONFIRM', {
          btn : '',
          fn : function() {
            deleteDataAction();
          }
        }, {
          btn : '',
          fn : function() {
          }
        });
      }

      /**
       * 데이터 삭제
       *
       * @param
       * @return
       */
      function deleteDataAction() {
        if (vm.data === null) {
          gAlert('', 'Menu.CANNOTDELETE');
          return;
        }

        // 업로드 파일 목록
        var uploadFileList = [];
        angular.forEach(vm.uploadFileList, function(item) {
          var obj = {
            id : item.id,
            fileName : item.fileName,
            size : item.size,
            fileKey : item.fileKey,
            typeId : 'file',
            path : item.path,
            delState : 'delete',
          };
          uploadFileList.push(obj);

        });
        vm.data['uploadFileList'] = uploadFileList;

        var data = vm.data;
        data.mapCode = 'BbsPost.deleteBbsPost';
        postApi.update(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            gAlert('', 'Menu.DELETED', {
              btn : '',
              fn : function() {
                vm.srch.BbsPostId = '';
                var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
                $state.go('app.bbspost.h0103-list', {
                  srch:srch
                }, {reload:'app.bbspost.h0103-list'});
              }
            });

          }
        }, function(error) {
          console.table(error);
        });
      }

      /**
       * Object Append 함수
       *
       * @param
       * @return
       */
      Array.prototype.append = function(array) {
        this.push.apply(this, array);
      };

      /**
       * 댓글 조회
       *
       * @param
       * @return
       */
      function getComment() {


        var data = vm.srchReply;
        data.mapCode = 'BbsPost.getBoardComment';
        postApi.select(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              if (vm.comment.lists == null) {
                vm.comment.lists = result.body.docs;
              } else {
                vm.comment.lists.append(result.body.docs);
              }
              vm.srchReply.LastId = result.body.docs[result.body.docs.length - 1].BbsPostCommId;

            }
          }
        }, function(error) {
          console.table(error);
        });
      }

      /**
       * 댓글 저장
       *
       * @param
       * @return
       */
      function saveComment() {
        if (angular.isUndefined(vm.srchReply.Contents) || vm.srchReply.Contents == null || vm.srchReply.Contents == '') {
          gAlert('', 'Menu.NOCONTENTS');
          return;
        }

        // 업로드 파일 목록
        vm.srchReply['uploadFileList'] = vm.uploadFileListReply;

        var data = vm.srchReply;
        data.mapCode = 'BbsPost.insertBoardComment';
        postApi.insert(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              if (result.body.docs[0].BbsPostCommId != 0) {
                vm.srchReply.Contents = '';
                vm.srchReply.uploadFileList = [];
                vm.uploadFileListReply = [];
                // 댓글 조회
                getComment();
                return;
              }
            }
          }
          console.table(result);
        }, function(error) {
          console.table(error);
        });
      }

      // 파일 삭제
      vm.setDeleteFileToggle = setDeleteFileToggle;

      /**
       * 파일 삭제
       *
       * @param
       * @return
       */
      function setDeleteFileToggle(replyObj) {
        var idx = -1;

        angular.forEach(vm.comment.lists, function(val, key) {
          if (val == replyObj) {
            idx = key;

          }
        });

        if (vm.comment.lists[idx].delState === '') {
          vm.comment.lists[idx].delState = 'delete';
        } else {
          vm.comment.lists[idx].delState = '';
        }
      }

      /**
       * 댓글 삭제
       *
       * @param
       * @return
       */
      function deleteComment(replyObj) {
        gConfirm('', 'Menu.DELETECONFIRM', {
          btn : '',
          fn : function() {
            deleteCommentAction(replyObj);
          }
        }, {
          btn : '',
          fn : function() {
          }
        });
      }

      /**
       * 댓글 삭제
       *
       * @param
       * @return
       */
      function deleteCommentAction(replyObj) {
        var srch = {
          BbsPostCommId : replyObj.BbsPostCommId,
          tableNm : "BbsPostComm",
          TableId : replyObj.BbsPostCommId
        };

        if (replyObj.AttachmentId != null) {
          var uploadFileList = [];

          var obj = {
            id : replyObj.AttachmentId,
            isLoaded : true,
            link : StaticVariable.getUrl('/attach/file/' + replyObj.PhysicalFileNm + '/download.do?path=' + replyObj.PhysicalFolderNm + '&fileName=' + replyObj.LogicalFileNm),
            fileName : replyObj.LogicalFileNm,
            size : replyObj.FileSize,
            fileKey : replyObj.PhysicalFileNm,
            path : replyObj.PhysicalFolderNm,
            downloadCnt : replyObj.DownloadCnt,
            delState : 'delete',
            typeId : 'file',
          };
          uploadFileList.push(obj);
          srch['uploadFileList'] = uploadFileList;
        }
        var data = srch;
        data.mapCode = 'BbsPost.deleteBoardComment';
        postApi.update(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            console.log('result',result);
            if (result.body.docs[0].BbsPostCommId != 0) {
              vm.comment.lists.forEach(function(item, index, object) {
                if (item.BbsPostCommId == replyObj.BbsPostCommId) {
                  object.splice(index, 1);
                }
              });
              return;
            }
          }
          console.table(result);
        },  function(error) {
          console.table(error);
        });
      }

      /**
       * 댓글 수정
       *
       * @param
       * @return
       */
      function editComment(BbsPostCommId) {
        vm.comment.editid = BbsPostCommId;

        vm.comment.lists.forEach(function(item, index, object) {
          if (item.BbsPostCommId === BbsPostCommId) {
            vm.comment.editContents = item.Contents;
          }
        });
      }

      /**
       * 댓글 수정
       *
       * @param
       * @return
       */
      function editCommentAction(replyObj) {
        var srch = {
          BbsPostCommId : replyObj.BbsPostCommId,
          Contents : vm.comment.editContents,
          TableNm : "BbsPostComm",
          TableId : replyObj.BbsPostCommId,
        };

        if (replyObj.AttachmentId != null) {
          var uploadFileList = [];

          var obj = {
            id : replyObj.AttachmentId,
            isLoaded : true,
            link : StaticVariable.getUrl('/attach/file/' + replyObj.PhysicalFileNm + '/download.do?path=' + replyObj.PhysicalFolderNm + '&fileName=' + replyObj.LogicalFileNm),
            fileName : replyObj.LogicalFileNm,
            size : replyObj.FileSize,
            fileKey : replyObj.PhysicalFileNm,
            path : replyObj.PhysicalFolderNm,
            downloadCnt : replyObj.DownloadCnt,
            delState : replyObj.delState,
            typeId : "file",
          };
          uploadFileList.push(obj);

          srch['uploadFileList'] = uploadFileList;
        }

        var data = srch;
        data.mapCode = 'BbsPost.updateBoardComment';
        postApi.update(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs[0].BbsPostCommId != 0) {
              vm.comment.lists.forEach(function(item, index, object) {
                if (item.BbsPostCommId === replyObj.BbsPostCommId) {
                  item.Contents = result.body.docs[0].Contents;
                  vm.comment.editid = null;

                  if (item.delState === 'delete') {
                    item.AttachmentId = '';
                    item.PhysicalFileNm = '';
                    item.PhysicalFolderNm = '';
                    item.LogicalFileNm = '';
                    item.FileSize = '';
                    item.DownloadCnt = '';
                    item.delState = '';
                  }
                }
              });
              return;
            }
          }
          console.table(result);
        }, function(error) {
          console.table(error);
        });
      }

      /**
       * 댓글 수정 취소
       *
       * @param
       * @return
       */
      function editCommentCancel() {
        vm.comment.editid = null;
        vm.comment.editContents = null;
      }

      vm.openDilalog = openDilalog;

      /**
       * 첨부파일 오픈 다이얼로그
       *
       * @param
       * @return
       */
      function openDilalog() {
        angular.element('#file-5').trigger("click");
      }

      var fileElement = angular.element('#file-5');
      fileElement.bind('change', function() {
        uploadFiles(fileElement[0].files);
      });

      vm.uploadFiles = uploadFiles;

      /**
       * 첨부파일 업로드
       *
       * @param {object}
       *          files - 첨부 파일
       * @return
       */
      function uploadFiles(files) {
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
                id : fileUploadId,
                delState : ''
              };

              tempIds.push(obj);

              if (vm.uploadFileListReply == null)
                vm.uploadFileListReply = [];
              vm.uploadFileListReply.push(angular.copy(obj));
              fileUploadId++;
            }
          });

          if (hasZeroByteFile) {
            gAlert('', 'Menu.NOCONTENTS');
            return;
          }

          request = fileUploadService.post(files, null, function(percent) {
            // -- 진행율 표시
            angular.forEach(tempIds, function(obj) {
              $('#filectl' + ' .progress .progress-bar').css('width', percent + '%');
            });

            if (percent == 100) {
              vm.showLoading = true;
            }
          });

          try {
            request.to(StaticVariable.getUrl('/attach/temp/upload.do?userkey='+$rootScope.gVariable.userKey)).then(function(value) {
              angular.forEach(value.data.responseVO.body.docs, function(item) {
                angular.forEach(vm.uploadFileListReply, function(obj) {
                  if (item.fileName == obj.fileName && item.size == obj.size) {
                    obj.isLoaded = true;
                    obj.fileKey = item.tmpFileKey;
                    obj.typeId = item.typeId;
                    obj.path = item.path;
                    obj.link = StaticVariable.getUrl("/attach/temp/" + item.tmpFileKey + "/download.do?fileName=" + item.encFileName);
                    obj.delState = '';
                  }
                });
              });

              // 올린 파일에 대해서는 Html의 file element가 가지고 있는 파일의 내용을 지워준다.
              angular.element('#file-5').val(null);

              vm.showLoading = false;
            }, function(error) {
              console.table(error);
            });
          } catch (error) {
            console.table(error);
          }
        });
      }
      vm.onDelete = onDelete;

      /**
       * 첨부파일 삭제 이벤트
       *
       * @param
       * @return
       */
      function onDelete(obj) {
        var idx = -1;
        angular.forEach(vm.uploadFileListReply, function(val, key) {
          if (val == obj) {
            idx = key;

          }
        });

        if (idx != -1) {
          if (vm.uploadFileListReply[idx].typeId == "temp") {
            var prms = fileUploadService.attachFileDelete().get({
              attachId : vm.uploadFileListReply[idx].fileKey
            }).$promise;

            prms.then(function(data) {
              console.table(data);
            }, function(error) {
              console.table(error);
            });
            vm.uploadFileListReply.splice(idx, 1);
          } else if (vm.callback) {
            vm.uploadFileListReply[idx].delState = 'delete';
          }
        }
      }
      vm.onDeleteCancel = onDeleteCancel;

      /**
       * 첨부파일 삭제 취소 이벤트
       *
       * @param
       * @return
       */
      function onDeleteCancel(obj) {
        var idx = -1;
        angular.forEach(vm.uploadFileListReply, function(val, key) {
          if (val == obj) {
            idx = key;

          }
        });

        if (idx != -1) {
          vm.uploadFileListReply[idx].delState = '';
        }
      }

      function goList() {
        vm.srch.BbsPostId = '';
        var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
        $state.go('app.bbspost.h0103-list', {
          srch : srch
        });
      }

      function goEdit() {
        vm.srch.BbsPostId = '';
        var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
        if (vm.layout == 'N') {
          $state.go('app.bbspost.h0103-edit', {
            srch : srch, BbsPostId : vm.data.BbsPostId
          });
        } else {
          $state.go('app.bbspost.h0103-list.edit', {
            srch : srch, BbsPostId : vm.data.BbsPostId
          });
        }
      }

      function setChangeTab(num){

        if (num == 0) {
          $scope.visbile = true;
          $scope.visbile1 = false;
          $scope.visbile2 = false;
          $scope.visbile3 = false;
          $scope.visbile4 = false;
        }
        else if (num == 1) {
          $scope.visbile = false;
          $scope.visbile1 = true;
          $scope.visbile2 = false;
          $scope.visbile3 = false;
          $scope.visbile4 = false;
        }
        else if (num == 2) {
          $scope.visbile = false;
          $scope.visbile1 = false;
          $scope.visbile2 = true;
          $scope.visbile3 = false;
          $scope.visbile4 = false;
        }
        else if (num == 3) {
          $scope.visbile = false;
          $scope.visbile2 = false;
          $scope.visbile3 = true;
          $scope.visbile4 = false;
          $scope.visbile5 = false;
        }
        else if (num == 4) {
          $scope.visbile = false;
          $scope.visbile2 = false;
          $scope.visbile3 = false;
          $scope.visbile4 = true;
          $scope.visbile5 = false;
        }
        else if (num == 5) {
          $scope.visbile = false;
          $scope.visbile2 = false;
          $scope.visbile3 = false;
          $scope.visbile4 = false;
          $scope.visbile5 = true;
        }
      }

      // 함수 선언
      vm.getData = getData;
      vm.getComment = getComment;
      vm.deleteData = deleteData;
      vm.saveComment = saveComment;
      vm.deleteComment = deleteComment;
      vm.editComment = editComment;
      vm.editCommentAction = editCommentAction;
      vm.editCommentCancel = editCommentCancel;
      vm.openMenu = openMenu;
      vm.goList = goList;
      vm.goEdit = goEdit;
      vm.setChangeTab = setChangeTab;

      // 데이터 조회
      getSelectViewColumns();

      getComment();
    } ]);
  })();
