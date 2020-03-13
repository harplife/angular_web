webapp.controller('BoardMngListCtrl', [ '$window', '$filter', 'GLOBAL_CONSTANT', 'BoardMngAPISrv','$stateParams','$scope','$state','$rootScope', 'postApi', 'gAlert',
  function BoardListCtrl($window, $filter, CONSTANT, boardMngApi, $stateParams, $scope, $state, $rootScope, postApi, gAlert) {
    var vm = this;// View Model

    vm.tablesort = tablesort;
    vm.sortClass = sortClass;
    vm.getSearch = getSearch;
    vm.makeSrch = makeSrch;
    vm.resetSearch = resetSearch;
    vm.pageChanged = pageChanged;

    var KEY_TABLE_NM = 'metatable';

    // 검색 옵션 설정
    if (!$stateParams.srch) {
      vm.srch = {
        page: 1, // 현재 조회 페이지 번호
        viewSize: !isNullOrEmpty(CONSTANT.PAGINATION.VIEWSIZE) ? CONSTANT.PAGINATION.VIEWSIZE : 10, // 페이지당 조회건수
        tableNm: KEY_TABLE_NM,  // 작업 테이블명
        sortDirect: '',         // 정렬순서 (ASC:오름차순, DESC:내림차순)
        sortColumn: ''          // 정렬컬럼명
      };
    } else {
      vm.srch = JSON.parse(decodeURIComponent($stateParams.srch));
      vm.srch.tableNm = !isNullOrEmpty($stateParams.srch.tableNm) ? $stateParams.srch.tableNm : KEY_TABLE_NM;
    }

    $scope.selectedRow = $stateParams.tableNm;
    vm.currentPage = vm.srch.page;
    vm.viewSize = vm.srch.viewSize;

    // 검색 조건 표시용 컬럼 목록
    vm.srchList = {};
    angular.copy(vm.srch, vm.srchList);
    vm.srchList.searchColumns = {};
    vm.layout = $rootScope.gVariable.layoutBoard; // 화면 분할모드 :  H(수평), V(수직), N(기본)
    vm.anchor = "";
    setLayout(vm.layout); // 화면분할 모드 설정

    //pagination
    vm.totalCount = 0;
    vm.viewSizePerPage = CONSTANT.PAGINATION.VIEWSIZE;
    vm.maxSize = CONSTANT.PAGINATION.MAXSIZE;
    vm.viewSizePerPageList = CONSTANT.PAGINATION.OPTION_VIEWSIZE;
    vm.dataloader = false;
    // 검색 선택 옵션
    vm.searchFieldTypeList = [ {
      optionId : 'all',
      optionName : '전체'
    }, {
      optionId : 'table',
      optionName: '물리 테이블명'
    }, {
      optionId : 'column',
      optionName: '물리 컬럼명'
    }, ];

    vm.changeViewSize = changeViewSize;
    vm.getMetaTableList = getMetaTableList;
    vm.changeLayout = changeLayout;
    vm.goDetail = goDetail;

    (function BoardListCtrl() {
      // 페이징
      vm.TenantId = $window.sessionStorage['loginTenantId'];
      vm.searchFieldType = vm.searchFieldTypeList[0].optionId;
      getMetaTableList();
    })();

    function changeViewSize() {
      vm.srch.page = 1;
      vm.srch.viewSize = vm.viewSize;
      var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
      $state.go('app.boardmng.list', {srch:srch}, {reload:'app.boardmng.list'});
    }

    $scope.$on('broadcastSetChangeTenantID', function(event, args) {
      getMetaTableList();
    });

    /**
     * 화면 분할 모드 설정
     * @param layout - 분할 모드 : H(수평), V(수직), N(기본)
     * @return
     */
    function setLayout(layout) {

      // 분할 모드 지정
      if (angular.isUndefined(layout)) {
        vm.layout = $rootScope.gVariable.layoutBoard;
      } else {
        vm.layout = layout;
      }

      switch (vm.layout) {
        case "H":
          // 수평
          vm.anchor = "north";
          vm.paneMin = "300px";
          break;
        case "V":
          // 수직
          vm.anchor = "west";
          vm.paneMin = "600px";
          break;
        case "N":
          // 기본
          vm.anchor = "";
          vm.paneMin = "600px";
          break;
      }
    }

    /**
     * 화면 분할 모드 변경
     * @param layout - 분할 모드 : H(수평), V(수직), N(기본)
     * @return
     */
    function changeLayout(layout) {
      // 분할 모드 설정값 저장
      $rootScope.changeLayout(layout);

      var srch = $stateParams.srch; // 검색 옵션

      $state.go('app.boardmng.list', {
        srch: makeSrch(),
        tableNm: ''
      }, {reload: 'app.boardmng.list'});
    }

    function getMetaTableList() {
      vm.srch.page = vm.currentPage;
      vm.dataloader = true;
      var data = vm.srch;
      data.mapCode = "boardmng/metatables";
      postApi.api(
        data,
        function(result) {
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              vm.boardList = result.body.docs;
              vm.currentPage = vm.boardList[0].page;
              vm.totalCount = vm.boardList[0].totalCount;
              vm.boardList.splice(0, 1);
              vm.dataloader = false;
            } else {
              vm.dataloader = false;
              var errMsg = result.body.docs.errMessage;
              gAlert("Menu.ERROR", errMsg);
              console.error("ErrorCode : ", result.body.docs.errCode, "ErrorMsg : ", result.body.docs.errMessage);
            }
          }
          vm.columnMap = '';
          vm.SearchConditionStr = getSearchConditionStr(vm.totalCount, vm.columnMap, vm.srch);
          vm.dataloader = false;
        },
        function(error) {
          console.error("Error> h0102-list-ctrl> getList()", status, error);
          vm.dataloader = false;
        }
      );
    }

    /* Sorting Methods */
    function tablesort(sortkey){
      if (vm.srch.sortColumn != sortkey) {
        vm.srch.sortDirect = "ASC";
        vm.sortDirect = vm.srch.sortDirect ;
      } else {
        vm.srch.sortDirect = (vm.srch.sortDirect == "ASC" ? "DESC" : "ASC");
        vm.sortDirect = vm.srch.sortDirect ;
      }

      vm.srch.sortColumn = sortkey;
      vm.sortColumn = sortkey;
      getSearch();
    }

    function sortClass(sortkey){
      if (sortkey != vm.srch.sortColumn)
        return 'fa fa-sort';

      var rtnval = '';

      if (vm.srch.sortDirect == 'ASC'){
        rtnval = 'fa fa-caret-down';
      } else {
        rtnval = 'fa fa-caret-up';
      }
      return rtnval;
    }

    function getSearch() {
      //      vm.srch.time = (new Date()).getTime();
      var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
      $state.go('app.boardmng.list', {srch:srch}, {reload:'app.boardmng.list'});
    }
    function makeSrch(){
      return encodeURIComponent(JSON.stringify(vm.srch, replacer));
    }

    function resetSearch() {
      $state.go('app.boardmng.list', {
        srch : ''
      }, {reload: 'app.boardmng.list'});
    }

    function goDetail(tableNm) {
      var srch = $stateParams.srch; // 검색 옵션
      $scope.selectedRow = tableNm;

      if (vm.layout == 'N') {
        // 조회 화면 이동
        $state.go('app.boardmng.modify', {
          srch: srch,
          tableNm: tableNm
        });
      } else {
        // 목록 조회 화면 이동
        $state.go('app.boardmng.list.modify', {
          srch: srch,
          tableNm: tableNm
        });
      }
    }

    function pageChanged() {
      vm.srch.page = vm.currentPage;
      var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
      $state.go('app.boardmng.list', {srch:srch}, {reload:'app.boardmng.list'});
    }
}, ]);
