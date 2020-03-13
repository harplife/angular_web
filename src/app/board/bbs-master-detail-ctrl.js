(function() {
  "use strict";
  /**
 * @ngdoc function
 * @name app.bbspost.bbs-master-detail-ctrl
 * @description # 게시판관리 상세보기 Controller
 */

webapp.controller('BbsMasterDetailCtrl', [ '$window', '$rootScope', '$scope', '$location', '$state', '$stateParams', 'GLOBAL_CONSTANT', 'StaticVariable', 'modalFactory', 'postApi',
    'gAlert', 'gConfirm',
/**
 * @param {object} $window - window object
 * @param {object} $scope - scope object
 * @param {object} $location - location object
 * @param {object} $state - state object
 * @param {object} $stateParams - state Parameter object
 * @param {object} CONSTANT - 전역 상수
 * @param {object} StaticVariable - StaticVariable object
 * @param {object} postApi - postApi Module
 * @param {object} gAlert - Alert Module *
 */

  function BbsMasterDetailCtrl($window, $rootScope, $scope, $location, $state, $stateParams, CONSTANT, StaticVariable, modalWindow, postApi, gAlert, gConfirm) {

    // View Model
    var vm = this;
    vm.dataloader = false;

    vm.srch = {};
    if (!$stateParams.srch) {
      vm.srch = {
        page : 1,
        viewSize : CONSTANT.PAGINATION.VIEWSIZE,
        BbsMasterId : $stateParams.srch.BbsMasterId ? $stateParams.srch.BbsMasterId  : '',
        TenantId : vm.TenantId,
        tableNm : $stateParams.srch.tableNm ? $stateParams.srch.tableNm : 'bbsmaster',
      };
    } else {
      vm.srch = JSON.parse(decodeURIComponent($stateParams.srch));
    }

    vm.layout = $rootScope.gVariable.layoutBoard;

    if ($stateParams.BbsMasterId != '') {
      vm.srch.BbsMasterId = $stateParams.BbsMasterId;
    }

    vm.srchDetail = {};
    angular.copy(vm.srch, vm.srchDetail);

    // 조회 데이터
    vm.data = {
      BbsMasterId : $stateParams.BbsMasterId,
      TenantId : vm.TenantId,
      tableNm : 'bbsmaster',
    };

    /**
     * 데이터 조회
     *
     * @param
     * @return
     * @author 최원영
    */
    function getData() {
      vm.dataloader = true;
      var data = vm.srchDetail;

      data.mapCode = 'BbsMaster.getBbsMasterDetail';

      postApi.select(data, function(result){
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length > 0) {
            vm.data = result.body.docs[0];
          }
        }
        vm.dataloader = false;
      },function(error) {
        console.error('Error> role-edit-ctrl> getData()', error);
        vm.dataloader = false;
        gAlert('', error.responseVO.body.docs[0].errMessage);
      });
    }

    function deleteDetail() {
      gConfirm('', 'Menu.DELETECONFIRM', {
        btn : '',
        fn : function() {
          deleteDetailAction();
        }
      }, {
        btn : '',
        fn : function() {
        }
      });
    }

    function deleteDetailAction() {
      if (vm.data == null) {
        gAlert('', 'Menu.CANNOTDELETE');
        return;
      }

      console.log("before delete", vm.data);

      var data = vm.data;
      data.mapCode = 'BbsMaster.deleteBbsMasterDetail';
      postApi.update(data, function(result){
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          gAlert('', 'Menu.DELETED', {
            btn : '',
            fn : function() {
              var srch = $stateParams.srch;
              $state.go('app.bbspost.bbs-master-list', {
                srch:srch
              }, {reload:'app.bbspost.bbs-master-list'});
            }
          });
          return;
        }
      }, function(error) {
        console.error('Error> role-detail-ctrl> deleteDataAction()', error);
        gAlert('', error.responseVO.body.docs[0].errMessage);
      });
    }

    function goList() {
      var srch = $stateParams.srch;
      $state.go('app.bbspost.bbs-master-list', {
        srch : srch
      });
    }

    function goEdit() {
      var srch = $stateParams.srch;
      if (vm.layout == 'N') {
        $state.go('app.bbspost.bbs-master-edit', {
          srch : srch, BbsMasterId : vm.data.BbsMasterId
        });
      } else {
        $state.go('app.bbspost.bbs-master-list.edit', {
          srch : srch, BbsMasterId : vm.data.BbsMasterId
        });
      }
    }

    // 함수 선언
    vm.getData = getData;
    vm.deleteDetail = deleteDetail;
    vm.goList = goList;
    vm.goEdit = goEdit;

    // 데이터 조회
    getData();
  }, ]);
})();
