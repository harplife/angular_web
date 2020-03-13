(function() {
  "use strict";
/**
 * @ngdoc function
 * @name app.bbspost.bbs-master-list-ctrl
 * @description
 * # 게시판관리 목록
 * Controller of the 게시판관리 목록
 */

webapp.controller('BbsMasterListCtrl', [ '$window', '$scope', '$location', '$state', '$stateParams', '$rootScope', 'GLOBAL_CONSTANT', 'modalFactory', 'postApi',
/**
 * @param $window - window object
 * @param $scope - scope object
 * @param $location - location object
 * @param $state - state object
 * @param $stateParams - state Parameter object
 * @param CONSTANT - 전역 상수
 * @param $rootScope - rootscope object
 * @param postApi - postApi Module
 */
  function BbsMasterListCtrl($window, $scope, $location, $state, $stateParams, $rootScope, CONSTANT, modalWindow, postApi) {

    // View Model
    var vm = this;
    vm.dataloader = false;

    // TenantId
    vm.TenantId = $window.sessionStorage['loginTenantId'];

    if (!$stateParams.srch) {
      vm.srch = {
        page : 1,
        viewSize : CONSTANT.PAGINATION.VIEWSIZE,
        tableNm : 'bbsmaster',
        TenantId : vm.TenantId,
        SysAdminYN : $window.sessionStorage['loginSysAdminYN'],
        CustType : '',
        UseYN : '',
        sortDirect : '',
        sortColumn : '',
      };
    } else {
      vm.srch = JSON.parse(decodeURIComponent($stateParams.srch));
      vm.srch.tableNm = vm.srch.tableNm ? vm.srch.tableNm : 'bbsmaster';
      if (!vm.srch.viewSize ) vm.srch.viewSize = CONSTANT.PAGINATION.VIEWSIZE; // 페이지당 조회건수
      vm.currentPage = vm.srch.page;
    }

    vm.keyId = $stateParams.BbsMasterId;
    vm.listSize = [ 10, 25, 50, 100 ];


    // 전역상수 선언
    vm.viewSize = CONSTANT.PAGINATION.VIEWSIZE;
    vm.maxSize = CONSTANT.PAGINATION.MAXSIZE;
    vm.srch.viewSize = vm.viewSize;

    // 검색 조건 표시용 컬럼 목록
    vm.srchList = {};
    angular.copy(vm.srch, vm.srchList);
    vm.srchList.searchColumns = {};
    vm.layout = $rootScope.gVariable.layoutBoard;
    vm.anchor = "";
    setLayout(vm.srch.layout);

    /* Sorting Methods */
    function tablesort(sortkey){
      if (vm.srch.sortColumn != sortkey) {
        vm.srch.sortDirect = "ASC";
      } else {
        vm.srch.sortDirect = (vm.srch.sortDirect == "ASC" ? "DESC" : "ASC");
      }

      vm.srch.sortColumn = sortkey;
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
      var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
      $state.go('app.bbspost.bbs-master-list', {srch:srch}, {reload:'app.bbspost.bbs-master-list'});
    }

    function resetSearch() {
      $state.go('app.bbspost.bbs-master-list', {srch : ''}, {reload:'app.bbspost.bbs-master-list'});
    }

    // 회원사 변경 체크
    $scope.$on('broadcastSetChangeTenantID', function(event, args) {
      getList();
    });

    /**
     * 데이터 조회
     *
     * @param
     * @return
     * @author 최원영
    */
    function getList() {
      vm.dataloader = true;
      vm.srch.page = vm.currentPage;

      getListCount();

      var data = vm.srch;
      data.mapCode = 'BbsMaster.getBbsMasterList';

      postApi.select(data, function(result) {
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length > 0) {
            vm.lists = result.body.docs;
          } else {
            vm.totalItems = 0;
            vm.lists = {};
          }
        }
        vm.columnMap = '';
        vm.SearchConditionStr = getSearchConditionStr(vm.totalItems, vm.columnMap, vm.srch);
        vm.dataloader = false;
      }, function(error) {
        console.error('Error-getList', error);
        vm.dataloader = false;
      });
    }

    function getListCount() {
      var data = vm.srch;
      data.mapCode = 'BbsMaster.getBbsMasterListCnt';

      postApi.select(data, function(result) {
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          if (result.body.docCnt > 0) {
            vm.totalItems = result.body.docs;
          } else {
            vm.totalItems = 0;
          }
        }
      }, function(error) {
        console.error('Error-getList', error);
      });
    }

    function goDetail(BbsMasterId) {
      var srch = $stateParams.srch;
      vm.keyId = BbsMasterId;
      if (vm.layout == 'N') {
        $state.go('app.bbspost.bbs-master-detail', {
          srch : srch,
          BbsMasterId : BbsMasterId,
        });
      } else {
        $state.go('app.bbspost.bbs-master-list.detail', {
          srch : srch,
          BbsMasterId : BbsMasterId,
        });
      }
    }

    function goEdit() {
      var srch = $stateParams.srch;
      if (vm.layout == 'N') {
        $state.go('app.bbspost.bbs-master-edit', {
          srch : srch,
          BbsMasterId : ''
        });
      } else {
        $state.go('app.bbspost.bbs-master-list.edit', {
          srch : srch,
          BbsMasterId : ''
        });
      }
    }

    /**
     * 페이지 번호 변경시 데이터 조회 함수 호출
     * @param
     * @return
     * @author 최원영
     */
    function pageChanged() {
      vm.srch.page = vm.currentPage;
      var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
      $state.go('app.bbspost.bbs-master-list', {srch:srch}, {reload:'app.bbspost.bbs-master-list'});
    }

    function changeViewSize() {
      vm.currentPage = 1;
      vm.viewSize = vm.srch.viewSize;
      getSearch();
    }

    function setLayout(layout) {
      if (angular.isUndefined(layout)) {
        vm.layout = $rootScope.gVariable.layoutBoard;
      } else {
        vm.layout = layout;
      }

      switch(vm.layout) {
        case "H":
          vm.anchor = "north";
          vm.paneMin = "300px";
          break;
        case "V":
          vm.anchor = "west";
          vm.paneMin = "600px";
          break;
        case "N":
          vm.anchor = "";
          vm.paneMin = "600px";
          break;
      }
    }

    function changeLayout(layout) {
      $window.sessionStorage.setItem('layoutBoard', layout);
      $rootScope.gVariable.layoutBoard = layout;
      var srch = $stateParams.srch;
      $state.go('app.bbspost.bbs-master-list', {srch : srch}, {reload:'app.bbspost.bbs-master-list'});
    }

    // 함수 선언
    vm.pageChanged = pageChanged;
    vm.getList = getList;
    vm.changeViewSize = changeViewSize;
    vm.getSearch = getSearch;
    vm.resetSearch = resetSearch;
    vm.sortClass = sortClass;
    vm.tablesort = tablesort;
    vm.setLayout = setLayout;
    vm.changeLayout = changeLayout;
    vm.goDetail = goDetail;
    vm.goEdit = goEdit;

    // 데이터 조회
    getList();
  }, ]);
})();
