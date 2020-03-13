/**
 * @ngdoc function
 * @name app.bbspost:h0102-edit-ctrl
 * @description
 * # 게시판 등록/수정
 * Controller of the 사용자정의 컬럼 게시판
 */
webapp.controller("H0102EditCtrl", ["$window", "$scope", "$location", "$state", "$stateParams", "$filter", "GLOBAL_CONSTANT",
                                   "StaticVariable", "H0102APISrv", "gAlert", "postApi", "customFieldApi", "$rootScope", '$timeout',
  /**
   * 게시판 - 등록/수정화면 Control
   * @param {object} $window - window object
   * @param {object} $scope - scope object
   * @param {object} $location - location object
   * @param {object} $state -  state object
   * @param {object} $stateParams - state Parameter object
   * @param {object} CONSTANT - 전역 상수
   * @param {object} StaticVariable - StaticVariable object
   * @param {object} H0102APISvr - H0102APISvr Module
   * @param {object} gAlert - Alert Module
   */
  function H0102EditCtrl($window, $scope, $location, $state, $stateParams, $filter, CONSTANT, StaticVariable, h0102Api, gAlert, postApi, customFieldApi, $rootScope, $timeout) {
    // View Model
    var LIST_PAGE_URL = 'app.bbspost.h0102-list';             // 목록 화면
    var LIST_VIEW_PAGE_URL = 'app.bbspost.h0102-list.detail'; // 목록 상세 화면
    var VIEW_PAGE_URL = 'app.bbspost.h0102-detail';           // 상세 화면

    var vm = this;
    vm.vault = null;

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
    vm.srchDetail.selectType = "Edit"; // For CustomColumn and FileAttachment

    // 업로드 파일 목록
    vm.uploadFileList = [];
    vm.showUploader = false;

    // 조회 데이터
    vm.data = {
      BbsMasterId: vm.srch.BbsMasterId != null ? vm.srch.BbsMasterId : 1,
      tableNm: vm.srch.tableNm,
      BbsPostId: vm.srch.BbsPostId
    };

    (function H0102EditCtrl() {
      console.log('H0102EditCtrl:');
    })();

    // 첨부파일 Callback
    vm.onFileCallback = {
      onFileUploaded: function (id, result) {
        // 첨부파일 업로드 완료
        $scope.$apply(function () {
          angular.forEach(result.body.docs, function (item) {
            var obj = item;
            obj.link = StaticVariable.getUrl(item.tmpLink) + "?fileName=" + item.fileName + "&userkey=" + $rootScope.gVariable.userKey;
            vm.uploadFileList.push(obj);
          });
        });
      },
      onFileUploadComplete: function (id) {
        // 첨부파일 업로드 이후 저장을 호출해야 함
        if (id == 'vault') {
          $timeout(setData, 1);
        }
      },
      onFileDelete: function(item) {
        console.log("delete item::", item);
        var param = {
          fileId: item.id
        };

        var prms = h0102Api.attachFileDelete().post(param).$promise;
        prms.then(function(data) {
          console.log(data);
          if (data.responseVO.header.status === CONSTANT.HttpStatus.OK) {
            gAlert("", "Menu.DELETED");
          }
        });
      },
      onLoaded: function(id, vault) {
        vm[id] = vault;
      }
    };

    /**
     * 사용자정의 컬럼 모델 설정
     *
     */
    function setUdcModel() {
      angular.forEach(Object.keys(vm.data), function(item) {
        // 사용자정의 컬럼 모델
        if (vm.udcDataType[item] == "40") {
          vm.udcModel[item] = $filter("date")(vm.data[item], "yyyy-MM-dd");
        } else {
          vm.udcModel[item] = vm.data[item];
        }
      });
    }

    /**
     * 첨부파일 목록 조회
     * @param
     * @return
     */
    function getFileList() {
      if (vm.srch.BbsPostId == null || vm.srch.BbsPostId == '0') {
        vm.dataloader = false;
        return;
      }

      var data = vm.srch;
      data.mapCode = "FileAttach.getFileList";
      postApi.select(data,
        function(result) {
          vm.dataloader = false;
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (!vm.showUploader) {
              // AngularJS Version
              var uploadFileList = [];
              angular.forEach(result.body.docs, function(item) {
                var obj = {
                  id: item.fileId,
                  isLoaded: true,
                  link: StaticVariable.getUrl(
                    "/attach/file/" +
                      item.PhysicalFileNm +
                      "/download.do?path=" +
                      item.PhysicalPath +
                      "&fileName=" +
                      item.LogicalFileNm
                  ),
                  fileName: item.LogicalFileNm,
                  size: item.FileSize,
                  fileKey: item.PhysicalFileNm,
                  typeId: "file",
                  path: item.PhysicalPath,
                  downloadCnt: item.DownloadCnt,
                  delState: ""
                };
                uploadFileList.push(obj);
              });

              angular.copy(uploadFileList, vm.uploadFileList);

            }
          }
        },
        function(error) {
          vm.dataloader = false;
          console.table(error);
        }
      );
    }

    /**
     * 데이터 조회
     * @param
     * @return
     */
    function getData() {
      vm.dataloader = true;
      vm.showUploader = enableUploadComponent();
      initVaultComponent('vault', vm.onFileCallback);

      vm.srchDetail.uploadFileList = []; // For CustomColumn and FileAttachment
      vm.srchDetail.viewColumns = {}; // For CustomColumn and FileAttachment

      postApi.select("BbsPost.getBbsPostDetail", vm.srchDetail,
        function(result) {
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.desc.length > 0) {
              vm.allColumns = result.body.desc;
              angular.forEach(vm.allColumns, function (item) {
                vm.columnMap[item.ColumnPhysicalNm] = item;
              });
            }

            if (result.body.docs.length > 0) {
              vm.data = result.body.docs[0];

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

          if (result.body.docs != null && result.body.docs[0].errMessage) {
            console.table(result);
          }
        },
        function(error) {
          vm.dataloader = false;
          console.table(error);
        }
      );
    }

    vm.uploadFile = function() {
      if (vm.vault != null && vm.vault.data.getLength() > 0) {
        uploadVaultFile(vm.vault);
      } else {
        setData();
      }
    };

    /**
     * 데이터 저장
     * @param
     * @return
     */
    function setData() {
      // 내용
      vm.dataloader = true;
      oEditors.getById["strHtml"].exec("UPDATE_CONTENTS_FIELD", []);

      vm.data.BbsMasterId = vm.srch.BbsMasterId;
      vm.data.Contents = $("#strHtml").val();
      vm.data.tableNm = vm.srch.tableNm;
      vm.data.RelateDataId = vm.data.BbsPostId;
      vm.data.IdName = "BbsPostId";
      vm.data.uploadFileList = vm.uploadFileList;
      vm.data.userkey = vm.srch.userkey;

      var data = vm.data;
      if (vm.data.BbsPostId == null || vm.srch.BbsPostId == "0") {
        // 등록
        data.mapCode = "BbsPost.insertBbsPost";
        postApi.insert(
          data,
          function(result) {
            InsertUpdateDetail(result);
          },
          function(error) {
            dataloader = false;
            console.table(error);
          }
        );
      } else {
        // 수정
        data.mapCode = "BbsPost.updateBbsPost";
        postApi.update(
          data,
          function(result) {
            InsertUpdateDetail(result);
          },
          function(error) {
            dataloader = false;
            console.table(error);
          }
        );
      }
    }

    function InsertUpdateDetail(result) {
      if (result.header.status === CONSTANT.HttpStatus.OK) {
        if (
          result.body.docs[0].BbsPostId !== null ||
          result.body.docs[0].KeyId !== null
        ) {
          // KeyId 조회
          vm.data.BbsPostId = result.body.docs[0].RelateDataId;

          gAlert("", "Menu.SAVED", {
            btn: "",
            fn: function() {
              goNextPage(true);
            }
          });
        }
      }

      dataloader = false;

      if (result.body.docs != null && result.body.docs[0].errMessage != null)
        console.table(result);
    }

    function goList() {
      vm.srch.BbsPostId = "";
      var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
      $state.go(LIST_PAGE_URL, { srch: srch });
    }

    function goNextPage(reloadList) {
      var srch = $stateParams.srch; // 검색 옵션

      if (vm.layout == 'N') {
        if (isNullOrEmpty(vm.srch.BbsPostId)) {
          // 신규등록 -> 목록 화면 이동
          $state.go(LIST_PAGE_URL, {srch: srch}, {reload:LIST_PAGE_URL});
        } else {
          // 수정 -> 조회 화면 이동
          $state.go(VIEW_PAGE_URL, {
            srch: srch,
            BbsPostId: vm.data.BbsPostId
          }, {reload:VIEW_PAGE_URL});
        }
      } else {
        if (reloadList) {
          vm.srch.BbsPostId = "";
          vm.srch.reload = (new Date()).getTime();
          srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
        }
        // 조회 화면 이동
        $state.go(LIST_VIEW_PAGE_URL, {srch: srch, BbsPostId: vm.data.BbsPostId});
      }
    }

    // 함수 선언
    vm.getData = getData;
    vm.setData = setData;
    vm.goList = goList;

    // 데이터 및 사용자정의 컬럼 모델 설정
    getData();
  }
]);
