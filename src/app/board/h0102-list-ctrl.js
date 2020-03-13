/* import { chmod } from "fs"; */
/**
 * @ngdoc function
 * @name app.bbspost:h0102-list-ctrl
 * @description
 * # 게시판 목록
 * Controller of the 사용자정의 컬럼 게시판
 */
webapp.controller('H0102ListCtrl', [ '$window', '$scope', '$location', '$state', '$stateParams', '$rootScope', 'GLOBAL_CONSTANT', 'postApi', '$compile', 'modalFactory', '$translate', '$filter',
  /**
   * 게시판 - 목록화면 Control
   * @param {object} $window - window object
   * @param {object} $scope - scope object
   * @param {object} $location - location object
   * @param {object} $state -  state object
   * @param {object} $stateParams - state Parameter object
   * @param {object} CONSTANT - 전역 상수
   * @param {object} $rootScope - rootscope object
   * @param {object} H0102APISvr - H0102APISvr Module
   */
  function H0102ListCtrl($window, $scope, $location, $state, $stateParams, $rootScope, CONSTANT, postApi, $compile, modalFactory, $translate, $filter) {

    var vm = this;
    vm.dataloader = false;

    vm.openModalUser = openModalUser;
    vm.clearUser = clearUser;

    if (!$stateParams.srch) {
      vm.srch = {
        page : 1,
        viewSize : CONSTANT.PAGINATION.VIEWSIZE,
        tableNm : $stateParams.srch.tableNm ? $stateParams.srch.tableNm : 'bbspost', // For CustomColumn and FileAttachment
        sortDirect : '',
        sortColumn : '',
      };
    } else {
      vm.srch = JSON.parse(decodeURIComponent($stateParams.srch));
      vm.srch.tableNm = vm.srch.tableNm ? vm.srch.tableNm : 'bbspost'; // For CustomColumn and FileAttachment
      vm.RegDateFrom = $rootScope.getDateFormat(vm.srch.RegDateFrom); // YYYY-MM-DD 를 date type 으로 변환
      vm.RegDateTo = $rootScope.getDateFormat(vm.srch.RegDateTo);
      vm.currentPage = vm.srch.page;
    }

    vm.keyId = $stateParams.BbsPostId;

    if (!isNullOrEmpty($stateParams.BbsMasterId)) {
      vm.srch.BbsMasterId = $stateParams.BbsMasterId;
    } else {
      vm.srch.BbsMasterId = 1;
    }

    vm.BbsNm = '사용자정의 게시판';

//    $compile($('#pane'))($scope);

    vm.listSize = [ 10, 25, 50, 100 ];

    // 검색 조건 표시용 컬럼 목록
    vm.srchList = {};
    vm.columnMap = {};
    angular.copy(vm.srch, vm.srchList);
    vm.srchList.searchColumns = {};
    vm.layout = $rootScope.gVariable.layoutBoard;
    vm.anchor = "";
    setLayout(vm.layout);

    (function H0102ListCtrl() {
      console.log('H0102ListCtrl:');
    })();

    // 회원사 변경 설정
    $scope.$on('broadcastSetChangeTenantID', function (event, data) {
      getList();

      $rootScope.showSimpleToast($translate.instant('MSG.LISTUPDATED'));
    });

    // 엑셀
    vm.excel = {
      downFileName : 'BbsPost',
      subject : '자유게시판 리스트',
      header : [ {
        field : 'BbsPostId',
        title : '번호',
        width : '5',
        format : 'number'
      }, {
        field : 'Title',
        title : '제목',
        width : '20',
        format : 'string'
      }, {
        field : 'RegUserNm',
        title : '등록자',
        width : '10',
        format : 'string'
      }, {
        field : 'RegDate',
        title : '등록일자',
        width : '10',
        format : 'date'
      }, {
        field : 'ReadCnt',
        title : '조회수',
        width : '5',
        format : 'string'
      }, {
        field : 'Reviewer',
        title : '평가자',
        width : '5',
        format : 'string'
      } ],
    };

    /*
    if ($window.sessionStorage.getItem('h0102-list-ctrl') !== null) {
      if ($rootScope.previousPage !== null &&
        ($rootScope.previousPage.indexOf('/app/bbspost/detail') !== -1 ||
        $rootScope.previousPage.indexOf('/app/bbspost/edit') !== -1)) {
        vm.srch = JSON.parse($window.sessionStorage.getItem('h0102-list-ctrl'));
        vm.currentPage = vm.srch.page;
      }
    }
     */

    // 전역상수 선언
    vm.viewSize = CONSTANT.PAGINATION.VIEWSIZE;
    vm.maxSize = CONSTANT.PAGINATION.MAXSIZE;
    vm.getAddressInfo = getAddressInfo;
    $scope.showDetail = function(li) {
      $location.url('/' + li.BbsPostId);
    };
    vm.srch.ZipCode = "";
    vm.srch.Addr1 = "";
    /* 다음 주소검색 */
    function getAddressInfo(){
      new daum.Postcode({
        oncomplete: function(data) {
          vm.zipCode = data.zonecode;
          vm.addr1 = data.buildingName!= "" ? data.address+" "+data.buildingName : data.address ;
          $('#zipCode').val(vm.zipCode);
          $('#addr1').val(vm.addr1);
        },
      }).open();
   }

    /* 사용자검색 */
    function openModalUser() {
      var ctrl = 'UserModalCtrl as modalCtrl';
      var paramData = { srchTenantId : $rootScope.gVariable.srchTenantId };

      var modalInstance = modalFactory.open('md', 'components/modal/users/user-modal.html', ctrl, paramData);
      modalInstance.result.then(function(res) {
        vm.srch.UserNm = res.UserNm;
        vm.srch.UserId = res.UserId;
      }, function(cancelData) {
      });
    }
    /* 사용자검색- 지우기 */
    function clearUser() {
      vm.srch.UserNm = '';
      vm.srch.UserId = '';
    }

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


    /* 단품(제품)조회 */
    function openModalPrd() {
      var ctrl = 'ProductModalCtrl as modalCtrl';
      var paramData = { srchTenantId : $rootScope.gVariable.srchTenantId };

      var modalInstance = modalFactory.open('md', 'components/modal/product/product-modal.html', ctrl, paramData);
      modalInstance.result.then(function(res) {
        vm.srch.ProductNm = res.ProductNm;
        vm.srch.ProductId = res.ProductId;
      }, function(cancelData) {
      });
    }
    /* 단품(제품)조회- 지우기 */
    function clearPrd() {
      vm.srch.ProductId = '';
      vm.srch.ProductNm = '';
    }

    /**
     * 데이터 조회
     * @param
     * @return
     * @author 최원영
     */
    function getList() {
      vm.dataloader = true;
      vm.viewSize = vm.srch.viewSize;

      getListCnt();

      var data = angular.copy(vm.srch);
      data.RegDateFrom = $filter('localToUtc')(data.RegDateFrom, 'from');
      data.RegDateTo = $filter('localToUtc')(data.RegDateTo, 'to');
      data.selectType = 'List'; // For CustomColumn
      data.mapCode = 'BbsPost.getBbsPostList';
      postApi.select(data, function(result){
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          if (result.body.desc.length > 0) {
            vm.listColumns = result.body.desc;
            angular.forEach(vm.listColumns, function(item) {
              vm.srchList.searchColumns[item.ColumnPhysicalNm] = true;
              vm.columnMap[item.ColumnPhysicalNm] = item;
            });
          }

          if (result.body.docs.length > 0) {
            vm.lists = result.body.docs;
            setResponsive();
          } else {
            vm.lists = {};
          }
        }

        vm.SearchConditionStr = getSearchConditionStr(vm.totalItems, vm.columnMap, vm.srch);
        vm.dataloader = false;
      }, function(error) {
        console.error('Error> h0102-list-ctrl> getList()', status, error);
        vm.dataloader = false;
      });

    }

    function getListCnt() {
      var data = angular.copy(vm.srch);
      data.RegDateFrom = $filter('localToUtc')(data.RegDateFrom, 'from');
      data.RegDateTo = $filter('localToUtc')(data.RegDateTo, 'to');
      data.mapCode = 'BbsPost.getBbsPostListCnt';
      postApi.select(data, function(result){
        /* console.log("type C", result.header);
        console.log("type c", result.body); */
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length > 0) {
            vm.totalItems = result.body.docs;
          } else {
            vm.totalItems = 0;
          }
        }
      }, function(error) {
        console.error('Error> h0102-list-ctrl> getListCnt()', status, error);
      });
    }

    function setResponsive(dockMode) {
      var rows =  vm.lists;
      var columns = [];
      var o = {};
      o.breakpoints = ["", "md","lg", "md","xs", "lg", "xs", "md", "lg"];
      //o.formatString = [""];
      o.type = [];
      o.style = [];

      var index = 0;
      angular.forEach(vm.listColumns, function(item) {
        var column = {};
        column.name = item.ColumnPhysicalNm;
        column.title = item.ColumnLogicalNm;
        if(o.breakpoints[index] != "") {
          column.breakpoints = setBreakPoint(o.breakpoints[index]);
        }
        if(item.ColumnPhysicalDataType == "40") {
          column.type = "date";
          column.formatString="YYYY-MM-DD";
        }
        index++;
        columns.push(column);
      });

      // if(!checkMobile()) {
      //   var mode = {};
      //   var localStorage = window.localStorage;
      //   (dockMode == undefined) ?
      //     mode.type = localStorage.getItem("dockMode") : mode.type = dockMode;
      //   setDockView($compile, $scope, mode, function(){
      //     $('#searchTextResults').footable({
      //       "columns": columns,
      //       "rows": rows,
      //       "ctrState" : $state,
      //       "key" : "BbsPostId",
      //       "link" : "app.bbspost.h0102-slist.detail",
      //       "srch" : vm.srch,
      //       "FreeBoardId" : 'W'
      //     }, function(ft) {
      //       initFootableEvent(vm,ft, function(e){

      //         var url = "http://localhost:3000/#/app/bbspost/h0102-detail/%257B%2522page%2522%253A1%252C%2522viewSize%2522%253A25%252C%2522BbsMasterId%2522%253A1%252C%2522tableNm%2522%253A%2522bbspost%2522%252C%2522searchColumns%2522%253A%257B%2522Title%2522%253Atrue%252C%2522ExtVarchar01%2522%253Atrue%252C%2522ExtInt01%2522%253Atrue%252C%2522ExtInt02%2522%253Atrue%252C%2522ExtDate01%2522%253Atrue%252C%2522ExtVarchar02%2522%253Atrue%252C%2522ExtDate02%2522%253Atrue%252C%2522RegDate%2522%253Atrue%252C%2522ExtVarchar03%2522%253Atrue%257D%252C%2522userkey%2522%253A%25225GU7YVI51O%2522%252C%2522totalItems%2522%253A%255B32%255D%252C%2522BbsPostId%2522%253A%2522W%2522%257D";
      //         console.log(url);
      //         vm.detailContent = jQuery.get(url);
      //           console.log(vm.detailContent)

      //       });
      //     });
      //   });
      // }
    }


    /**
     * 페이지 번호 변경시 데이터 조회 함수 호출
     * @param
     * @return
     * @author 최원영
     */
    function pageChanged() {
      vm.srch.page = vm.currentPage;
      vm.srch.srchTenantId = $rootScope.gVariable.srchTenantId;
      var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
      $state.go('app.bbspost.h0102-list', {srch:srch}, {reload:'app.bbspost.h0102-list'});
    }

    /**
     * 엑셀파일 다운로드
     * @param
     * @return
     * @author 최원영
     */
    function getExcel() {

      vm.excel.param = vm.srch;
      var data = vm.excel;

      data.mapCode = 'BbsPost.getExcelBbsPostList';
      postApi.excel(data, function(result){
        console.log("type C", result.header);
        console.log("type c", result.body);
      }, function(error) {
        console.error('Error> h0102-list-ctrl> getExcel()', status, error);
      });
/*
      vm.excel.param = vm.srch;

      var prms = h0102Api.doExcel().post(vm.excel).$promise;

      prms.then(function(data) {
      }, function(error) {
        console.error('Error> h0102-list-ctrl> getExcel()', status, error);
      }); */
    }

    function changeViewSize() {
      vm.currentPage = 1;
      vm.viewSize = vm.srch.viewSize;
      console.log('srch :: ch ::',vm.viewSize);
      getSearch();
    }

    function getSearch() {
//      vm.srch.time = (new Date()).getTime();
      var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
      $state.go('app.bbspost.h0102-list', {srch:srch}, {reload:'app.bbspost.h0102-list'});
    }

    function resetSearch() {
      $state.go('app.bbspost.h0102-list', {srch : ''}, {reload:'app.bbspost.h0102-list'});
    }

    vm.test = test;
    function test(id) {
      return "/app/bbspost/h0102-list/bbspost//"+id;
    }

    function goDetail(BbsPostId) {
      //vm.srch.BbsPostId = BbsPostId;
      var srch = $stateParams.srch;
      vm.keyId = BbsPostId;
      if (vm.layout == 'N') {
        $state.go('app.bbspost.h0102-detail', {
          srch : srch,
          BbsPostId : BbsPostId,
          BbsMasterId : vm.srch.BbsMasterId
        });
      } else {
        $state.go('app.bbspost.h0102-list.detail', {
          srch : srch,
          BbsPostId : BbsPostId,
          BbsMasterId : vm.srch.BbsMasterId
        });
      }
    }

    function goEdit() {
      var srch = $stateParams.srch;
      vm.keyId = '';
      if (vm.layout == 'N') {
        $state.go('app.bbspost.h0102-edit', {
          srch : srch, BbsPostId : ''
        });
      } else {
        $state.go('app.bbspost.h0102-list.edit', {
          srch : srch, BbsPostId : ''
        });
      }
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
          vm.paneMin = "480px";
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
      $state.go('app.bbspost.h0102-list', {
        srch : srch
      }, {reload: 'app.bbspost.h0102-list'});
    }

    function getBbsNm() {
      var data = {BbsMasterId:vm.srch.BbsMasterId};
      data.mapCode = 'BbsMaster.getBbsMasterDetail';
      postApi.select(data, function(result){
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length > 0) {
            vm.BbsNm = result.body.docs[0].BbsNm;
          }
        }
        vm.dataloader = false;
      }, function(error) {
        console.error('Error> h0102-list-ctrl> getList()', status, error);
        vm.dataloader = false;
      });
    }

    // 함수 선언
    vm.pageChanged = pageChanged;
    vm.getList = getList;
    vm.getExcel = getExcel;
    vm.changeViewSize = changeViewSize;
    vm.getSearch = getSearch;
    vm.goDetail = goDetail;
    vm.goEdit = goEdit;
    vm.resetSearch = resetSearch;
    vm.setResponsive = setResponsive;
    vm.setLayout = setLayout;
    vm.changeLayout = changeLayout;
    vm.tablesort = tablesort;
    vm.sortClass = sortClass;
    vm.clearPrd = clearPrd;
    vm.openModalPrd = openModalPrd;

    // 데이터 조회
    getBbsNm();
    getList();

  }
]);

