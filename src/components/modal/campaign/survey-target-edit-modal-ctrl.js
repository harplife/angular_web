webapp.controller('surveyTargetEditCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', '$rootScope', 'modalFactory', '$mdUtil', '$stateParams','$http', 'gAlert', 'gConfirm',
    function surveyTargetEditCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi, $rootScope, modalFactory, $mdUtil,$stateParams,$http, gAlert, gConfirm) {

      var vm = this;
      vm.dataloader = false;
      vm.srch = {};
      vm.maxGrpId = 0;
      vm.lists = [];
      vm.saveYn = true;
      vm.data = {GrpId: toModalData.GrpId};

      $scope.toggleLeft = buildToggler('left');
      $scope.toggleRight = buildToggler('right');

      // 함수 선언
      vm.resetList = resetList;
      vm.deleteGrpcust = deleteGrpcust;
      vm.addGrpcustAll = addGrpcustAll;

      vm.setPageChanged = setPageChanged;         // 페이지 변경시 데이터 조회
      vm.setChangeViewSize = setChangeViewSize;   // 목록 당 조회 건수 변경
      vm.setSortColumn = setSortColumn;           // 정렬 설정
      vm.setSortDirect = setSortDirect;           // 정렬 설정에 따른 Grid header Icon 표시
      vm.doUpload = doUpload;
      vm.excelform = excelform; //엑셀업로드양식 다운
      vm.cancel = cancel;
      vm.ok = ok;


      // --------------------------------------------------------- 그룹고객 관련 소스 ---------------------------------------------------------
      // SQL Mapper Id 정의
      var LIST_CNT_SQL = 'WjmCampaign.getGroupcustomerListCnt'; // 그룹고객 목록 건수 조회 SQL
      var LIST_SQL = 'WjmCampaign.getGroupcustomerList';    // 그룹고객 목록 조회 SQL
      var EXCEL_SQL = 'WjmCampaign.getGroupcustomerExcelList'; // 그룹고객 엑셀다운로드 SQL
      var DELETE_LIST_SQL = 'WjmCampaign.deleteGroupcustomerList'; // 그룹고객 목록에서 삭제
      var DELETEALL_LIST_SQL = 'WjmCampaign.deleteAllGroupcustomerList'; // 그룹고객 목록에서 전체삭제
      var ADDGRPCUSTALL_SQL = 'WjmCampaign.insertAllGroupcustomer'; // 그룹고객 목록에서 고객전체추가

      // 관련 테이블 정의
      var KEY_TABLE_NM = 'wjm.surveytargetlist'; // 그룹고객 작업 테이블명
      var KEY_COLUMN_NM = 'CustId'; // 그룹고객 Primary Key Column
      var EXCEL_TITLE = '그룹고객목록'; // 그룹고객 엑셀파일 이름
      var EXCEL_FORM_TITLE = '일괄업로드 양식';
      // #endregion 상수 정의

      // 검색 옵션 설정
      if (!$stateParams.srch) {
        vm.srch = {
          page: 1, // 현재 조회 페이지 번호
          viewSize: !isNullOrEmpty(CONSTANT.PAGINATION.VIEWSIZE) ? CONSTANT.PAGINATION.VIEWSIZE : 10, // 페이지당 조회건수
          tableNm: KEY_TABLE_NM,  // 작업 테이블명
          sortDirect: 'DESC',     // 정렬순서 (ASC:오름차순, DESC:내림차순)
          sortColumn: 'T.RegDate' // 정렬컬럼명
        };
      } else {
        vm.srch = JSON.parse(decodeURIComponent($stateParams.srch));
        vm.srch.tableNm = !isNullOrEmpty($stateParams.srch.tableNm) ? $stateParams.srch.tableNm : KEY_TABLE_NM;
        vm.currentPage = vm.srch.page;
      }

      vm.listSize = CONSTANT.PAGINATION.LISTSIZE; // 목록당 표시건수

      // 검색 조건 표시용 컬럼 목록
      vm.srchList = {};
      vm.columnMap = {};
      angular.copy(vm.srch, vm.srchList);
      //vm.layout = $rootScope.gVariable.layoutBoard; // 화면 분할모드 :  H(수평), V(수직), N(기본)
      vm.anchor = "";
      //setLayout(vm.layout); // 화면분할 모드 설정

      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      function ok() {

        $uibModalInstance.close(vm.grpcustLists);
      }

      /**
       * 전체고객 추가
       *
       * @param
       * @return
       */
      function addGrpcustAll() {
        var data;

        data = vm.srch;
        data.GrpId = vm.data.GrpId;

        data.mapCode = ADDGRPCUSTALL_SQL;

        postApi.update(data, function (result) {
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            gAlert('', 'Menu.SAVED', {
              btn : '',
              fn : function() {
                getGrpcustList();
              }
            });
          }
        }, function (error) {
          // 조회 중 오류 발생
          console.error("Error> addGrpcustAll()");
          console.table(error);
        });
      }

      /**
       * 그룹고객 목록 삭제
       *
       * @param
       * @return
       */
      function deleteGrpcust(type) {
        gConfirm('', 'Menu.DELETECONFIRM', {
          btn : '',
          fn : function() {
            deleteGrpcustAction(type);
          }
        }, {
          btn : '',
          fn : function() {
          }
        });
      }

      function deleteGrpcustAction(type) {
        vm.delData = [];
        if (type == "") {
          angular.forEach(vm.grpcustLists, function(item){

            if (item.chkRow) {
              vm.delData.push(item);

            }
          });
          angular.forEach(vm.delData, function(item){
            console.log(vm.delData);
            vm.grpcustLists.splice(vm.grpcustLists.indexOf(item),1);
          });
        } else if (type == "ALL") {
          vm.grpcustLists = [];
        }

      }

      /**
       * 그룹고객 목록 건수 조회
       *
       * @param
       * @return
       */
      function getGrpcustListCnt() {

        var data = vm.srch; // 검색 옵션 설정
        data.mapCode = LIST_CNT_SQL; // 목록 건수 조회 SQL Mapper ID

        data.GrpId = vm.data.GrpId;

        postApi.select(data, function (result) {
          if (result.header.status === CONSTANT.HttpStatus.OK) {

            if (result.body.docs.length > 0) {
              // 총 목록 건수 설정
              vm.grpcustTotalItems = result.body.docs;
            } else {
              // 조회 실패
              vm.grpcustTotalItems = 0;
            }
          }
        }, function (error) {
          // 조회 중 오류 발생
          console.error("Error> getGrpcustListCnt()");
          console.table(error);
        });
      }

      /**
       * 그룹고객 목록 조회
       *
       * @param
       * @return
       */
      function getGrpcustList() {
        vm.dataloader = true; // Progressbar 표시
        vm.viewSize = vm.srch.viewSize; // 목록당 조회건수 설정

        getGrpcustListCnt(); // 목록 건수 조회

        var data = vm.srch; // 검색 옵션 설정
        data.selectType = 'List'; // 사용자정의 컬럼의 조회 유형 설정
        data.mapCode = LIST_SQL;

        data.GrpId = vm.data.GrpId;

        postApi.select(data, function (result) {
          if (result.header.status === CONSTANT.HttpStatus.OK) {

            // MetaColumn 사용
            if (result.body.desc.length > 0) {
              // MetaColumn 정보를 이용하여 표시할 목록 정보 설정
              vm.grpcustListColumns = result.body.desc;
              angular.forEach(vm.grpcustListColumns, function (item) {
                vm.columnMap[item.ColumnPhysicalNm] = item;
              });
            } else {
              console.error('Error> getGrpcustList()> MetaColumn 정보 조회 오류');
              console.table(data);
            }

            if (result.body.docs.length > 0 && !isNullOrEmpty(vm.grpcustListColumns)) {
              // 목록 데이터 표시
              if(false) {
                vm.grpcustLists = result.body.docs;
              } else if(!isNullOrEmpty(toModalData.GrpTotalList)) {
                vm.grpcustLists = toModalData.GrpTotalList;
              }

              // 목록 화면 구성
              setResponsive();
            } else {
              // 데이터 조회 실패
              vm.grpcustLists = [];
            }
          }

          vm.dataloader = false; // Progressbar 숨김

        }, function (error) {
          vm.dataloader = false; // Progressbar 숨김

          // 조회 중 오류 발생
          console.error("Error> getGrpcustList()");
          console.table(error);
        });
      }

      /**
       * 그룹고객 목록 화면 구성
       *
       * @param
       * @return
       */
      function setResponsive() {
        var columns = [];
        var o = {};

        o.breakpoints = ["", "md", "lg", "md", "xs", "lg", "xs", "md", "lg"]; // Bootstrap 컬럼 css
        o.type = [];
        o.style = [];

        var index = 0;
        angular.forEach(vm.grpcustListColumns, function (item) {
          var column = {};

          column.name = item.ColumnPhysicalNm; // 물리 컬럼명
          column.title = item.ColumnLogicalNm; // 논리 컬럼명

          if (o.breakpoints[index] != "") {
            column.breakpoints = setBreakPoint(o.breakpoints[index]);
          }

          if (item.ColumnPhysicalDataType == "40") {
            // 날짜형 데이터 처리
            column.type = "date";
            column.formatString = "YYYY-MM-DD";
          }

          index++;
          columns.push(column);
        });
      }

      /**
       * 그룹고객 페이지 변경시 데이터 조회
       * @param
       * @return
       */
      function setPageChanged() {
        vm.srch.page = vm.currentPage; // 조회 할 페이지 번호

        // 검색 옵션
        //var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
        // 해당 페이지 데이터 조회
        //$state.go(LIST_PAGE_URL, {srch: srch}, {reload: LIST_PAGE_URL});

        getGrpcustList();
      }

      /**
       * 그룹고객 목록 당 조회 건수 변경
       * @param
       * @return
       */
      function setChangeViewSize() {
        vm.currentPage = 1; // 1페이지 부터 조회
        vm.viewSize = vm.srch.viewSize; // 목록 당 조회 건수

        // 데이터 조회
        //getSearch();
        getGrpcustList();
      }

      /**
       * 그룹고객 정렬 컬럼 설정
       *
       * @param {string} sortColumn  - 정렬 컬럼명
       * @param {string} isSortable - 정렬가능 여부
       * @return
       */
      function setSortColumn(sortColumn, isSortable) {

        // 정렬이 불가한 컬럼은 미 반영
        if (isSortable == 'N') return;

        // 정렬순서(오름차순, 내림차순) 설정
        if (vm.srch.sortColumn != sortColumn) {
          vm.srch.sortDirect = "ASC";
        } else {
          vm.srch.sortDirect = (vm.srch.sortDirect == "ASC" ? "DESC" : "ASC");
        }

        vm.srch.sortColumn = sortColumn;

        // 조회
        //getSearch();
        getGrpcustList();
      }

      /**
       * 그룹고객 정렬 컬럼 설정에 따른 Grid header Icon 표시
       *
       * @param {string} sortColumn  - 정렬 컬럼명
       * @return
       */
      function setSortDirect(sortColumn) {
        // 정렬이 되지 않은 컬럼 표시
        if (sortColumn != vm.srch.sortColumn) {
          return 'fa fa-sort';
        }

        var rtnval = '';

        // 정렬순서(오름차순, 내림차순)에 따른 Icon 표시
        if (vm.srch.sortDirect == 'ASC') {
          rtnval = 'fa fa-caret-down';
        } else {
          rtnval = 'fa fa-caret-up';
        }
        return rtnval;
      }

      /**
       * 그룹고객 Excel 파일 다운로드
       * @param
       * @return
       */
      function getExcelFile() {

        if (vm.grpcustLists.length == undefined) {
          gAlert("", "조회 후 엑셀을 다운로드 하십시오.");
          return;
        }

        if (vm.grpcustLists.length == 0) {
          gAlert("", "Menu.데이터가 없습니다.");
          return;
        }

        var a = document.createElement("a");
        document.body.appendChild(a);

        var data = vm.srch;
        data.mapCode = EXCEL_SQL;

        postApi.select(data, function (result) {
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            $scope.jsonToExport = result.body.docs;
            $scope.fileName = EXCEL_TITLE;
            $scope.exportData = [];

            var obj = [];

            angular.forEach(vm.columnMap, function (item) {
              obj.push(item.ColumnLogicalNm);
            });
            $scope.exportData.push(obj);

            // Data:
            angular.forEach($scope.jsonToExport, function (value) {
              obj = [];
              angular.forEach(vm.columnMap, function (item) {
                if (item.ColumnPhysicalNm == 'BirthDay' || item.ColumnPhysicalNm == 'CustRegDt' || item.ColumnPhysicalNm == 'LastVisitDt') {
                  if (!isNullOrEmpty(value[item.ColumnPhysicalNm])) {
                    obj.push(moment(value[item.ColumnPhysicalNm]).toDate());
                  } else {
                    obj.push(value[item.ColumnPhysicalNm]);
                  }
                }
                else {
                  obj.push(value[item.ColumnPhysicalNm]);
                }
              });
              $scope.exportData.push(obj);
            });

            $rootScope.excelDown($scope.exportData, $scope.fileName);
          }
        }, function (error) {
          // 조회 중 오류 발생
          console.error("Error> getExcelFile()");
          console.table(error);
        });
      }

      // 회원사 변경 설정
      $scope.$on('broadcastSetChangeTenantID', function (event, data) {
        getTreeList();
        getGrpcustList();

        $rootScope.showSimpleToast($translate.instant('MSG.LISTUPDATED'));
      });

      vm.viewSize = CONSTANT.PAGINATION.VIEWSIZE; // 페이지당 조회건수
      vm.maxSize = CONSTANT.PAGINATION.MAXSIZE;   // 최대 조회건수


      /**
       * Build handler to open/close a SideNav; when animation finishes
       * report completion in console
       */
      function buildToggler(navID) {
        var debounceFn = $mdUtil.debounce(function() {
          $mdSidenav(navID).toggle().then(function() {
            console.debug("toggle " + navID + " is done");
          });
        }, 200);
        return debounceFn;
      }

      $scope.init = function() {
        // check if there is query in url
        // and fire search in case its value is not empty
      };

      // stops the interval
      $scope.$on("$destroy", function() {
      });

      $scope.$on('broadcastSetChangeTenantID', function(event, data) {
        resetList();

        $rootScope.showSimpleToast($translate.instant('MSG.LISTUPDATED'));
      });

      // 목록 체크박스 로직 설정
      vm.chkHead = false;
      $scope.chkRowChg = function () {
        for (var i = 0; i < vm.grpcustLists.length; i++) {
          if (!vm.grpcustLists[i].isChecked) {
            vm.chkHead = false;
            return;
          }
        }
        vm.chkHead = true;
      };

      $scope.chkHeadChg = function () {
        for (var i = 0; i < vm.grpcustLists.length; i++) {
          vm.grpcustLists[i].chkRow = vm.chkHead;
        }
      };

      /*
      function resetSearch() {
        vm.srch.GrpNm = '';
        vm.data = {CustomCode: 0};
        tree.select_branch(null);
      }
      */

      function resetList() {
        //resetSearch();

        getTreeList();
      }

      /*
      vm.nextSearch = function() {
        tree.next_search_text();
      };
      */


      // 일괄 업로드
      function doUpload()  {
        vm.dataloader = true;

        var file = $("input[name=excelFile]")[0].files[0];
        var formData = new FormData();
        var uploadUrl = "excelUpload/WjmCampaign.updateSurveyTargetExcel/action.json";
        var ext = file.name.split('.').pop().toLowerCase();

        if(file == undefined || $.inArray(ext, ['xlsx']) == -1){
          vm.dataloader = false;
          gAlert('', 'xlsx 형식의 파일을 선택하세요.');
          return;
        }

        formData.append("mFile",file);
        formData.append("ext",ext);
        formData.append("GrpId", vm.data.GrpId);
        formData.append("Manager",vm.data.Manager);
        formData.append("SESSION_USERID", $rootScope.gVariable.UserId);
        formData.append("SESSION_TENANTID", $rootScope.gVariable.TenantId);

        $http({
          url: uploadUrl,
          method: "POST",
          data: formData,
          transformRequest: angular.identity,
          headers: {'Content-type': undefined}
        }).success(function (data, status, headers, config) {
          vm.dataloader = false;

          //gAlert('', data.responseVO.body.docs[0].message.replace(/<br>/gi, "\r\n"));
          var lists = [];

          angular.forEach(data.responseVO.body.docs[0].dataList, function (item) {
            lists = [];
            lists.CustNm =  item.column_0 != "false" ? item.column_0 : null;
            lists.Mobile = item.column_1 != "false" ? item.column_1 : null;
            lists.Email = item.column_2 != "false" ? item.column_2 : null;
            vm.grpcustLists.push(lists);

          });

          vm.grpcustTotalItems = vm.grpcustLists.length;

        }).error(function (data, status, headers, config) {
          vm.dataloader = false;
          gAlert('', '오류가 발생했습니다.');
        });
        vm.dataloader = false;
      }
      /**
         * Excel 업로드 양식 다운로드
         * @param
         * @return
      */
      function excelform () {
        var a = document.createElement("a");
        document.body.appendChild(a);

        $scope.jsonToExport = [];
        $scope.fileName = EXCEL_FORM_TITLE;
        $scope.exportData = [];

        $scope.exportData.push(['이름','휴대폰','이메일'],
          ['나고객','010-1234-5678','test@naver.com']);
        $rootScope.excelDown($scope.exportData,$scope.fileName);

      };

      vm.topItem = null;

      /**
       * 고객추가
       *
       * @param {string}
       * @return {boolean}
       */
      vm.GroupCustEditModal = function () {
        var ctrl = 'GroupEditModalCtrl as vc';
        var paramData = {keyId : '', GrpId: vm.data.GrpId, GrpNm : vm.data.GrpNm, Manager: vm.data.Manager};
        var modalInstance = modalFactory.open("md", "components/modal/survey/wjm-group-edit-modal.html", ctrl, paramData);
        modalInstance.result.then(
          function (okData) {
            getGrpcustList();
          },
          function (cancelData) {
          }
        );
      }

    vm.alertMsg = function () {
      gAlert('준비중입니다.');
    }
    // 목록 조회
      getGrpcustList();
    } ]);
