/**
 * @ngdoc function
 * @name app.bbspost:h0102-edit-ctrl
 * @description
 * # 게시판 등록/수정
 * Controller of the 사용자정의 컬럼 게시판
 */
webapp.controller("H0103EditCtrl", ["$window", "$scope", "$location", "$state", "$stateParams", "$filter", "GLOBAL_CONSTANT",
                                   "StaticVariable", "H0102APISrv", "gAlert", "postApi", "customFieldApi", "$rootScope",
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
  function H0103EditCtrl($window, $scope, $location, $state, $stateParams, $filter, CONSTANT, StaticVariable, h0102Api, gAlert, postApi, customFieldApi, $rootScope) {
    // View Model
    var vm = this;

    vm.srch = {};
    // 페이징
    if ($stateParams.srch) {
      vm.srch = JSON.parse(decodeURIComponent($stateParams.srch));
    }

    if (vm.srch.layout == null) vm.layout = "N";
    else vm.layout = vm.srch.layout;

    if ($stateParams.BbsPostId) {
      vm.srch.BbsPostId = $stateParams.BbsPostId;
    }

    vm.srchDetail = {};
    angular.copy(vm.srch, vm.srchDetail);
    vm.srchDetail.uploadFileList = [];

    // 업로드 파일 목록
    vm.uploadFileList = [];
    vm.showUploader = false;

    // 등록/수정 표시용 컬럼 목록
    vm.srchDetail.editColumns = {};
    // 조회 데이터
    vm.data = {
      BbsMasterId: vm.srch.BbsMasterId != null ? vm.srch.BbsMasterId : 1,
      tableNm: vm.srch.tableNm,
      BbsPostId: vm.srch.BbsPostId
    };

    // 사용자정의 컬럼 폼
    vm.udcForm = {};

    // 사용자정의 컬럼 모델
    vm.udcModel = {};
    vm.udcDataType = {};

    // 사용자정의 컬럼정보
    vm.udcColumns = [];

    // 사용자정의 컬럼 옵션
    vm.udcOptions = {
      formState: {
        horizontalLabelClass: "",
        horizontalFieldClass: "",
        readOnly: false
      }
    };

    // 사용자정의 컬럼 데이터
    vm.udcData = [];

    // 첨부파일 Callback
    vm.onFileCallback = {
      onFileUploadComplete: function() {
        console.log("file items::", vm.uploadFileList);
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
     * 1) 화면 표시 컬럼 목록
     * 2) 사용자정의 컬럼 모델 정보
     * 3) 사용자정의 컬럼 정보
     * @param
     * @return
     */
    function getSelectEditColumns() {
      var data = vm.srchDetail;
      data.uploadFileList = [];
      data.viewColumns = {};
      data.mapCode = "MetaColumn.getSelectEditColumns";
      postApi.select(
        data,
        function(result) {
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              vm.allColumns = result.body.docs;

              angular.forEach(vm.allColumns, function(item) {
                // 화면 표시 컬럼 목록
                if (item.EditColumnShowYN === "Y") {
                  vm.srchDetail.viewColumns[item.ColumnPhysicalNm] = true;
                }

                // 사용자정의 컬럼 모델 정보
                if (item.CustomColumnYN === "Y") {
                  vm.udcModel[item.ColumnPhysicalNm] = "";
                  vm.udcDataType[item.ColumnPhysicalNm] =
                    item.ColumnPhysicalDataType;
                }
              });

              // 사용자정의 컬럼 정보
              //setUdcColumns();
              vm.udcColumns = customFieldApi.setEditableUdcColumns(
                vm.allColumns
              );

              // 데이터 조회
              getData();
            }
          }
        },
        function(error) {
          console.error(
            "Error> h0103-detail-ctrl> getSelectViewColumns()",
            status,
            error
          );
        }
      );
    }

    /**
     * 첨부파일 목록 조회
     * @param
     * @return
     */
    function getFileList() {
      vm.showUploader = enableUploadComponent();

      if (vm.srch.BbsPostId === null || vm.srch.BbsPostId === 0) {
        return;
      }

      var data = vm.srch;
      data.mapCode = "FileAttach.getFileList";
      postApi.select(
        data,
        function(result) {
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
              return;
            } else {
              // JS Component Version
              initVaultComponent();
            }
          }
        },
        function(error) {
          console.error("Error> h0103-edit-ctrl> getFileList()", status, error);
          gAlert("", error.responseVO.body.docs[0].errMessage);
        }
      );
    }

    /**
     * 데이터 조회
     * @param
     * @return
     */
    function getData() {
      if (vm.srch.BbsPostId == null || vm.srch.BbsPostId == "0") {
        return;
      }

      postApi.select("BbsPost.getBbsPostDetail", vm.srchDetail,
        function(result) {
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              vm.data = result.body.docs[0];

              // 사용자정의 컬럼 모델 적용
              if (vm.udcColumns.length > 0) setUdcModel();

              // 첨부파일 목록 조회
              getFileList();

              return;
            }
          }
          gAlert("", result.body.docs[0].errMessage);
        },
        function(error) {
          console.error("Error> h0102-edit-ctrl> getData()", status, error);
          gAlert("", error.responseVO.body.docs[0].errMessage);
        }
      );
    }

    /**
     * 사용자정의 컬럼 데이터 저장
     */
    function setUdcData() {
      vm.data.udcData = [];

      angular.forEach(vm.udcColumns, function(items) {
        angular.forEach(items.fieldGroup, function(item) {
          var row = {};

          var udcCols = vm.allColumns.filter(function(x) {
            return x.ColumnPhysicalNm === item.key;
          })[0];

          //          var udcCols = vm.allColumns.filter(x => x.ColumnPhysicalNm === item.key)[0];

          if (udcCols !== undefined) {
            row.MetaTableId = udcCols.MetaTableId;
            row.MetaColumnId = udcCols.MetaColumnId;
            row.RelateDataId = vm.data.BbsPostId;
            row.TextValue = udcCols.ColumnPhysicalDataType === "10" || udcCols.ColumnPhysicalDataType === "50"? vm.udcModel[item.key] : "";
            row.IntegerValue = udcCols.ColumnPhysicalDataType === "20"? vm.udcModel[item.key] : "0";
            row.DoubleValue = udcCols.ColumnPhysicalDataType === "30"? vm.udcModel[item.key] : "0";
            row.DateValue = udcCols.ColumnPhysicalDataType === "40"? vm.udcModel[item.key] : "";

            vm.data.udcData.push(row);
          }
        });
      });

      var prms = null;

      if (vm.srch.BbsPostId == null || vm.srch.BbsPostId == "0") {
        // 등록
        prms = h0102Api.doInsertUdcDetail().post(vm.data).$promise;
      } else {
        // 수정
        console.log("test,udc");
        prms = h0102Api.doUpdateUdcDetail().post(vm.data).$promise;
      }

      prms.then(
        function(data) {
          if (data.responseVO.header.status == CONSTANT.HttpStatus.OK) {
            console.log(vm.srch);

            gAlert("", "Menu.SAVED", {
              btn: "",
              fn: function() {
                if (vm.srch.BbsPostId == null || vm.srch.BbsPostId == "0") {
                  $state.go("app.bbspost.h0103-list", {
                    tableNm: vm.data.tableNm,
                    BbsMasterId: vm.data.BbsMasterId,
                    srch: ""
                  });
                } else {
                  // 조회 화면 이동
                  $state.go("app.bbspost.h0103-detail", {
                    tableNm: vm.data.tableNm,
                    BbsMasterId: vm.data.BbsMasterId,
                    BbsPostId: vm.data.BbsPostId
                  });
                }
              }
            });
            return;
          }
          gAlert("", data.responseVO.body.docs[0].errMessage);
        },
        function(error) {
          console.error("Error> h0103-edit-ctrl> setData()", status, error);
          gAlert("", error.responseVO.body.docs[0].errMessage);
        }
      );
    }

    /**
     * 데이터 저장
     * @param
     * @return
     */
    function setData() {
      // 내용
      oEditors.getById["strHtml"].exec("UPDATE_CONTENTS_FIELD", []);

      vm.data.Contents = $("#strHtml").val();
      vm.data.tableNm = vm.srch.tableNm;
      vm.data.TableId = vm.data.BbsPostId;
      vm.data.IdName = "BbsPostId";
      vm.data.uploadFileList = vm.uploadFileList;
      vm.data.userkey = vm.srch.userkey;

      vm.data.udcData = [];

      angular.forEach(vm.udcColumns, function(items) {
        angular.forEach(items.fieldGroup, function(item) {
          var udcCols = vm.allColumns.filter(function(x) {
            return x.ColumnPhysicalNm === item.key;
          })[0];

          //          var udcCols = vm.allColumns.filter(x => x.ColumnPhysicalNm === item.key)[0];

          if (udcCols !== undefined) {
            vm.data[udcCols.ColumnPhysicalNm] = vm.udcModel[item.key];
          }
        });
      });

      var data = vm.data;
      console.log("data ::", vm.data);
      if (vm.data.BbsPostId == null || vm.srch.BbsPostId == "0") {
        // 등록
        data.mapCode = "BbsPost.insertBbsPost";
        postApi.insert(
          data,
          function(result) {
            InsertUpdateDetail(result);
          },
          function(error) {
            console.error("Error> h0103-edit-ctrl> setData()", status, error);
            gAlert("", result.responseVO.body.docs[0].errMessage);
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
            console.error("Error> h0103-edit-ctrl> setData()", status, error);
            gAlert("", result.responseVO.body.docs[0].errMessage);
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
          vm.data.BbsPostId = result.body.docs[0].BbsPostId;

          gAlert("", "Menu.SAVED", {
            btn: "",
            fn: function() {
              var srch = "";

              if (vm.layout == 'N') {
                if (vm.srch.BbsPostId == null || vm.srch.BbsPostId == "0") {
                  vm.srch.BbsPostId = "";
                  srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
                  $state.go("app.bbspost.h0103-list", { srch: srch });
                } else {
                  // 조회 화면 이동
                  srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
                  $state.go("app.bbspost.h0103-detail", {
                    srch: srch,
                    BbsPostId: vm.data.BbsPostId
                  });
                }
              } else {
                vm.srch.BbsPostId = "";
                vm.srch.reload = (new Date()).getTime();
                srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
                $state.go("app.bbspost.h0103-list.detail", { srch: srch, BbsPostId:vm.data.BbsPostId });
              }
            }
          });
          return;
        }
      }
      gAlert("", result.body.docs[0].errMessage);
    }

    function goList() {
      vm.srch.BbsPostId = "";
      var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
      $state.go("app.bbspost.h0103-list", { srch: srch });
    }

    // 함수 선언
    vm.getData = getData;
    vm.setData = setData;
    vm.goList = goList;

    // 데이터 및 사용자정의 컬럼 모델 설정
    getSelectEditColumns();
  }
]);
