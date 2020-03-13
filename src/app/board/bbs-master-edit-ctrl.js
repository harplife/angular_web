/**
 * @ngdoc function
 * @name app.bbspost.bbs-master-edit-ctrl
 * @description
 * # 게시판관리 등록/수정
 * Controller of the 게시판관리
 */
webapp.controller('BbsMasterEditCtrl', [ '$window', '$rootScope', '$scope', '$location', '$state', '$stateParams', 'GLOBAL_CONSTANT', 'StaticVariable', 'modalFactory', 'postApi',
    'gAlert', 'gConfirm',
/**
 * @param {object} $window - window object
 * @param {object} $scope - scope object
 * @param {object} $location - location object
 * @param {object} $state -  state object
 * @param {object} $stateParams - state Parameter object
 * @param {object} CONSTANT - 전역 상수
 * @param {object} StaticVariable - StaticVariable object
 * @param {object} postApi - postApi Module
 * @param {object} gAlert - Alert Module
 */

  function BbsMasterEditCtrl($window, $rootScope, $scope, $location, $state, $stateParams, CONSTANT, StaticVariable, modalFactory, postApi, gAlert, gConfirm) {
    // View Model
    var vm = this;
    vm.dataloader = false;

    vm.srch = {};
    if (!$stateParams.srch) {
      vm.srch = {
        page : 1,
        viewSize : CONSTANT.PAGINATION.VIEWSIZE,
        BbsMasterId : $stateParams.srch.BbsMasterId ? $stateParams.srch.BbsMasterId : '',
        tableNm : $stateParams.srch.tableNm ? $stateParams.srch.tableNm : 'Users',
        TenantId : vm.TenantId,
      };
    } else {
      vm.srch = JSON.parse(decodeURIComponent($stateParams.srch));
    }

    vm.layout = $rootScope.gVariable.layoutBoard;

    if ($stateParams.BbsMasterId) {
      vm.srch.BbsMasterId = $stateParams.BbsMasterId;
    }

    vm.srchDetail = {};
    angular.copy(vm.srch, vm.srchDetail);

    // 조회 데이터
    vm.data = {
      BbsMasterId : vm.srch.BbsMasterId != null ? $stateParams.BbsMasterId : '',
      TenantId : vm.TenantId,
      tableNm : vm.srch.tableNm,
    };

    /**
     * 데이터 조회
     *
     * @param
     * @return
     * @author rohbi
    */
    function getData() {
      vm.dataloader = true;
      if (vm.srch.BbsMasterId == null || vm.srch.BbsMasterId == '') {
        vm.dataloader = false;
        return;
      }

      var data = vm.srchDetail;
      data.mapCode = 'BbsMaster.getBbsMasterDetail';

      postApi.select(data, function(result){
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length > 0) {
            vm.data = result.body.docs[0];

            vm.dataloader = false;
            return;
          }
        } else {
          vm.dataloader = false;
        }
        console.table(result);
      }, function(error) {
        console.table(error);
        vm.dataloader = false;

      });
    }

    /**
     * 데이터 저장
     *
     * @param
     * @return
     * @author 최원영
    */
    function setData() {
      // 내용
      vm.data.tableNm = vm.srch.tableNm;
      vm.data.TableId = vm.data.BbsMasterId;

      var data = vm.data;

      if (vm.data.BbsMasterId == null || vm.data.BbsMasterId == '') {
        // 등록
        data.mapcode = "BbsMaster.insertBbsMasterDetail";
        postApi.insert(data, function(result){
          InsertUpdateDetail(result);
        },function(error) {
          console.table(error);
        });
      } else {
        // 수정
        data.mapCode = "BbsMaster.updateBbsMasterDetail";
        postApi.update(data, function(result){
          InsertUpdateDetail(result);
        },function(error) {
          console.table(error);
        });
      }
    }

    function InsertUpdateDetail(result) {
      if (result.header.status === CONSTANT.HttpStatus.OK) {
        if (result.body.docs[0].BbsMasterId !== null || result.body.docs[0].TableId !== null) {
          // KeyId 조회
          vm.data.BbsMasterId = result.body.docs[0].BbsMasterId;

          gAlert("", "Menu.SAVED", {
            btn: "",
            fn: function() {
              var srch = $stateParams.srch;

              if (vm.layout == 'N') {
                if (vm.srch.BbsMasterId == null || vm.srch.BbsMasterId == '') {
                  $state.go("app.bbspost.bbs-master-list", { srch: srch });
                } else {
                  // 조회 화면 이동
                  $state.go("app.bbspost.bbs-master-detail", {
                    srch: srch,
                    BbsMasterId: vm.data.BbsMasterId
                  });
                }
              } else {
                vm.srch.BbsMasterId = "";
                vm.srch.reload = (new Date()).getTime();
                srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
                $state.go("app.bbspost.bbs-master-list.detail", { srch: srch, BbsMasterId:vm.data.BbsMasterId });
              }
            }
          });
          return;
        }
      }
      console.table(result);
    }

    function goList() {
      vm.srch.BbsMasterId = "";
      var srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
      $state.go("app.bbspost.bbs-master-list", { srch: srch });
    }

    // 함수 선언
    vm.getData = getData;
    vm.setData = setData;
    vm.goList = goList;

    // 데이터 조회
    getData();

    }, ]);
