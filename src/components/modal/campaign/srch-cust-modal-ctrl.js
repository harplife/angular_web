webapp.controller('SrchCustModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', '$rootScope', 'modalFactory',
    function SrchCustModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi, $rootScope, modalFactory) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getList = getList;
      vm.currentPage = 1;
      vm.columnMap = {};

      vm.viewSize = CONSTANT.PAGINATION.VIEWSIZE; // 페이지당 조회건수
      vm.maxSize = CONSTANT.PAGINATION.MAXSIZE;   // 최대 조회건수
      vm.listSize = CONSTANT.PAGINATION.LISTSIZE; // 목록당 표시건수

      vm.selectedTenantId = toModalData.TenantId;

    // 관련 테이블 정의
    var KEY_TABLE_NM = 'campaign.srchcustomer'; // 그룹고객 작업 테이블명
    var LIST_SQL = 'Campaign2.getSrchCustomerList';
    var LIST_CNT_SQL = 'Campaign2.getSrchCustomerListCnt';

    vm.srch = {
      page: 1, // 현재 조회 페이지 번호
      viewSize: !isNullOrEmpty(CONSTANT.PAGINATION.VIEWSIZE) ? CONSTANT.PAGINATION.VIEWSIZE : 10, // 페이지당 조회건수
      userkey : '',
      tableNm : KEY_TABLE_NM,
    };

    vm.currentPage = vm.srch.page;

      (function SrchCustModalCtrl() {
        getList();
      })();


      function getList() {
        vm.dataloader = true; // Progressbar 표시
        vm.viewSize = vm.srch.viewSize; // 목록당 조회건수 설정

        getListCnt(); // 목록 건수 조회

        var data = angular.copy(vm.srch); // 검색 옵션 설정
        data.selectType = 'List'; // 사용자정의 컬럼의 조회 유형 설정
        data.mapCode = LIST_SQL;

        postApi.select(data, function (result) {
          if (result.header.status === CONSTANT.HttpStatus.OK) {

            // MetaColumn 사용
            if (result.body.desc.length > 0) {
              // MetaColumn 정보를 이용하여 표시할 목록 정보 설정
              vm.listColumns = result.body.desc;
              angular.forEach(vm.listColumns, function (item) {
                vm.columnMap[item.ColumnPhysicalNm] = item;
              });
            } else {
              console.error('Error> getList()> MetaColumn 정보 조회 오류');
              console.table(data);
            }

            if (result.body.docs.length > 0 && !isNullOrEmpty(vm.listColumns)) {
              // 목록 데이터 표시
              vm.lists = result.body.docs;
              // 목록 화면 구성
              setResponsive();
            } else {
              // 데이터 조회 실패
              vm.lists = {};
            }
          }

          vm.dataloader = false; // Progressbar 숨김

        }, function (error) {
          vm.dataloader = false; // Progressbar 숨김

          // 조회 중 오류 발생
          console.error("Error> getList()");
          console.table(error);

        });
      }

      function getListCnt() {
        var data = angular.copy(vm.srch); // 검색 옵션 설정
        data.mapCode = LIST_CNT_SQL;

        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            vm.totalItems = result.body.docs[0];
          }
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
      angular.forEach(vm.listColumns, function (item) {
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

      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      function ok(item) {
        $uibModalInstance.close(item);
      }
      /**
       * 페이지 변경시 데이터 조회
       * @param
       * @return
       */
      function pageChanged() {
        vm.srch.page = vm.currentPage;
        getList();

      }

          /* 사용자검색 */
    function srchUserModal() {

      var ctrl = 'UserModalCtrl as modalCtrl';
      var paramData = { srchTenantId : $rootScope.gVariable.srchTenantId };

      var modalInstance = modalFactory.open('lg', 'components/modal/users/user-modal.html', ctrl, paramData);
      modalInstance.result.then(function(res) {
        vm.srch.ManagerNm = res.UserNm;
        vm.srch.ManagerId = res.UserId;
      }, function(cancelData) {
      });
    }
    /* 사용자검색- 지우기 */
    function eraseUser() {
      vm.srch.ManagerNm = '';
      vm.srch.ManagerId = '';
    }

    // 목록 체크박스 로직 설정
    vm.chkHead = false;
    $scope.chkRowChg = function () {
      for (var i = 0; i < vm.lists.length; i++) {
        if (!vm.lists[i].isChecked) {
          vm.chkHead = false;
          return;
        }
      }
      vm.chkHead = true;
    };

    $scope.chkHeadChg = function () {
      for (var i = 0; i < vm.lists.length; i++) {
        vm.lists[i].chkRow = vm.chkHead;
      }
    };

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
      getList();
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

      getList();
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
      getList();
    }



      vm.pageChanged = pageChanged;
      vm.srchUserModal = srchUserModal;
      vm.eraseUser = eraseUser;
      vm.setSortColumn = setSortColumn;           // 정렬 설정
      vm.setSortDirect = setSortDirect;           // 정렬 설정에 따른 Grid header Icon 표시
      vm.setPageChanged = setPageChanged;
      vm.setChangeViewSize = setChangeViewSize;

    } ]);
