(function() {
  "use strict";
  /**
 * @ngdoc function
 * @name app.bbspost:h0102-detail-ctrl
 * @description # 게시판 조회 Controller of the 사용자정의 컬럼 게시판
 */
webapp.controller('H0102DetailCtrl', [ '$window', '$scope', '$location', '$state', '$stateParams', '$filter', 'GLOBAL_CONSTANT', 'StaticVariable', 'H0102APISrv', 'gAlert', 'gConfirm',
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
    function H0102DetailCtrl($window, $scope, $location, $state, $stateParams, $filter, CONSTANT, StaticVariable, h0102Api, gAlert, gConfirm, fileUploadService, postApi, customFieldApi, $rootScope) {
      // View Model
      var vm = this;
      vm.dataloader = false;

      vm.srch = {};
      if (!$stateParams.srch) {
        vm.srch = {
          page : 1,
          viewSize : CONSTANT.PAGINATION.VIEWSIZE,
          tableNm : $stateParams.srch.tableNm ? $stateParams.srch.tableNm : 'bbspost', // For CustomColumn and FileAttachment
        };
      } else {
        vm.srch = JSON.parse(decodeURIComponent($stateParams.srch));
      }

      vm.layout = $rootScope.gVariable.layoutBoard;

      if (!isNullOrEmpty($stateParams.BbsMasterId)) {
        vm.srch.BbsMasterId = $stateParams.BbsMasterId;
      } else {
        vm.srch.BbsMasterId = 1;
      }

      if (!isNullOrEmpty($stateParams.BbsPostId)) {
        vm.srch.BbsPostId = $stateParams.BbsPostId;
      }

      vm.srchDetail = {};
      vm.columnMap = {};
      angular.copy(vm.srch, vm.srchDetail);
      vm.srchDetail.uploadFileList = []; // For CustomColumn and FileAttachment
      vm.srchDetail.IdName = 'BbsPostId'; // For CustomColumn and FileAttachment
      vm.srchDetail.selectType = "Detail"; // For CustomColumn and FileAttachment

      // 조회 데이터
      vm.data = {
        TableNm : vm.srchDetail.TableNm,
        BbsPostId : vm.srchDetail.BbsPostId,
      };

      // 댓글
      vm.comment = {};

      // 댓글 조회 조건
      vm.srchReply = {
        BbsMasterId : vm.srch.BbsMasterId != '' ? vm.srch.BbsMasterId : 1,
        tableNm : 'bbspostcomm', // For CustomColumn and FileAttachment
        BbsPostId : vm.srch.BbsPostId,
        TableId : vm.srch.BbsPostId,
        IdName : 'BbsPostCommId', // For CustomColumn and FileAttachment
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

      (function H0102DetailCtrl() {
        console.log('H0102DetailCtrl:');
      })();

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
                  link : StaticVariable.getUrl('/attach/file/' + item.PhysicalFileNm + '/download.do?userkey=' + $rootScope.gVariable.userKey),
                  fileName : item.LogicalFileNm,
                  size : item.FileSize,
                  fileKey : item.PhysicalFileNm,
                  path : item.PhysicalPath,
                  downloadCnt : item.DownloadCnt,
                };
                uploadFileList.push(obj);
              });

              angular.copy(uploadFileList, vm.uploadFileList);
              return;
            }
          }
        },function(error) {
          console.error('Error> h0102-detail-ctrl> getFileList()', status, error);
          gAlert('', result.body.docs[0].errMessage);
        });
      }
      /**
       * 데이터 조회
       *
       * @param
       * @return
       */
      function getData() {
        vm.dataloader = true;
        vm.srchDetail.uploadFileList = []; // For CustomColumn and FileAttachment
        vm.srchDetail.viewColumns = {}; // For CustomColumn and FileAttachment
        postApi.select('BbsPost.getBbsPostDetail', vm.srchDetail, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.desc.length > 0) {
              vm.allColumns = result.body.desc;

              angular.forEach(vm.allColumns, function(item) {
                vm.columnMap[item.ColumnPhysicalNm] = item;
              });
            }

            if (result.body.docs.length > 0) {
              vm.data = result.body.docs[0];

              console.log($filter('utcToLocal')(vm.data.RegDate,'yyyy-MM-dd h:mm a'));

              var uploadFileList = [];

              angular.forEach(vm.data.uploadFileList, function(item) {
                var obj = {
                  id : item.fileId,
                  isLoaded : true,
                  link : StaticVariable.getFileDownloadUrl(item.PhysicalFileNm),
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
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> h0102-edit-ctrl> getData()', status, error);
          vm.dataloader = false;
          gAlert('', error.responseVO.body.docs[0].errMessage);
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
        if (vm.data == null) {
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
        data.RelateDataId = data.BbsPostId;
        data.mapCode = 'BbsPost.deleteBbsPost';
        postApi.update(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            gAlert('', 'Menu.DELETED', {
              btn : '',
              fn : function() {
                var srch = $stateParams.srch;
                $state.go('app.bbspost.h0102-list', {
                  srch:srch
                }, {reload:'app.bbspost.h0102-list'});
              }
            });
            return;
          }
        }, function(error) {
          console.error('Error> h0102-detail-ctrl> deleteDataAction()', status, error);
          gAlert('', error.responseVO.body.docs[0].errMessage);
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
      }

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
              return;
            }
          }
        }, function(error) {
          console.error('Error> h0102-detail-ctrl> getReply()', status, error);
          gAlert('', result.body.docs[0].errMessage, {
            btn : '',
            fn : function() {
              var srch = $stateParams.srch;
              $state.go('app.bbspost.h0102-list', {
                srch : srch
              });
            }
          });
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
          console.error('Error> h0102-detail-ctrl> saveComment()', status, data);
          gAlert('', result.body.docs[0].errMessage);
        }, function(error) {
          console.error('Error> h0102-detail-ctrl> saveComment()', status, error);
          gAlert('', result.body.docs[0].errMessage);
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
            return;
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
          gAlert('', result.body.docs[0].errMessage);
        },  function(error) {
          console.error('Error> h0102-detail-ctrl> deleteCommentAction()', status, error);
          gAlert('', error.responseVO.body.docs[0].errMessage);
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
          }
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
          gAlert('', result.body.docs[0].errMessage);
        }, function(error) {
          console.error('Error> h0102-detail-ctrl> editCommentAction()', status, error)
          gAlert('', error.body.docs[0].errMessage);
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
                vm.uploadFileListReply = new Array();
              vm.uploadFileListReply.push(angular.copy(obj));
              fileUploadId++;
            }
          });

          if (hasZeroByteFile) {
            gAlert('', 'Menu.NOCONTENTS');
            return;
          }

          var request = fileUploadService.post(files, null, function(percent) {
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
                    obj.tmpFileKey = item.tmpFileKey;
                    obj.typeId = item.typeId;
                    obj.path = item.path;
                    obj.link = StaticVariable.getUrl("/attach/temp/" + item.tmpFileKey + "/download.do?userkey=" + $rootScope.gVariable.userKey + "&fileName=" + item.encFileName);
                    obj.delState = '';
                  }
                });
              });

              // 올린 파일에 대해서는 Html의 file element가 가지고 있는 파일의 내용을 지워준다.
              angular.element('#file-5').val(null);

              vm.showLoading = false;
            }, function(error) {
              console.error('Error> h0102-detail-ctrl> uploadFiles()', status, error);
            });
          } catch (error) {
            console.error('Error> h0102-detail-ctrl> uploadFiles()', status, error);
          }
        });
      }
      ;

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
            return;
          }
        });

        if (idx != -1) {
          if (vm.uploadFileListReply[idx].typeId == "temp") {
            var prms = fileUploadService.attachFileDelete().get({
              attachId : vm.uploadFileListReply[idx].tmpFileKey
            }).$promise;

            prms.then(function(data) {
              console.log('Success> h0102-detail-ctrl> onDelete()', data);
            }, function(error) {
              console.error('Error> h0102-detail-ctrl> onDelete()', status, error);
            })
            vm.uploadFileListReply.splice(idx, 1);
          } else if (vm.callback) {
            vm.uploadFileListReply[idx].delState = 'delete';
          }
        }
      }
      ;

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
            return;
          }
        });

        if (idx != -1) {
          vm.uploadFileListReply[idx].delState = '';
        }
      }

      function goList() {
        var srch = $stateParams.srch;
        $state.go('app.bbspost.h0102-list', {
          srch : srch
        });
      }

      function goEdit() {
        var srch = $stateParams.srch;
        if (vm.layout == 'N') {
          $state.go('app.bbspost.h0102-edit', {
            srch : srch, BbsPostId : vm.data.BbsPostId
          });
        } else {
          $state.go('app.bbspost.h0102-list.edit', {
            srch : srch, BbsPostId : vm.data.BbsPostId
          });
        }
      }

      function openAttachment(li) {
        window.location = StaticVariable.getUrl('/attach/file/' + li.PhysicalFileNm + '/download.do?userkey=' + $rootScope.gVariable.userKey + '&path=' + li.PhysicalFolderNm + "&fileName=" + li.LogicalFileNm);
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
      vm.openAttachment = openAttachment;

      // 데이터 조회
      getData();

      getComment();
    } ]);
  })();
