webapp.controller('TenantModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi',
    function TenantModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getList = getList;
      vm.currentPage = 1;
      vm.maxSize = 10;

      vm.srch = {
		    TenantNm : '',
        TenantId : '',
        viewSize : 10,
        Ceo :'',
      };

      vm.selectedTenantId = toModalData.TenantId;
      if (toModalData.showBaseTenant == undefined || toModalData.showBaseTenant == null) {
        vm.showBaseTenant = 'Y';
      } else if(toModalData.showBaseTenant != undefined && toModalData.showBaseTenant != '') {
        if(!toModalData.showBaseTenant) vm.showBaseTenant = 'N';
        else vm.showBaseTenant = 'Y';
      } else if (!toModalData.showBaseTenant) {
        vm.showBaseTenant = 'N';
      } else {
        vm.showBaseTenant = 'Y';
      }

      (function TenantModalCtrl() {
        getList();
      })();
      function getList() {

        var data = {
          mapCode: 'Tenant.getTenantSrch',
          TenantNm : vm.srch.TenantNm,
          Ceo : vm.srch.Ceo,
          userkey : '',
          showBaseTenant : vm.showBaseTenant,
          page : vm.srch.page,
        };

        if($window.sessionStorage['loginTenantId']!= null && $window.sessionStorage['loginTenantId'] != "" && $window.sessionStorage['loginTenantId'] != undefined){

          getCnt(true);

          data.mapCode= 'Tenant.getTenantSrch';
          postApi.select(data, function (result) {
            if(result.header.status == CONSTANT.HttpStatus.OK) {
              vm.tenantlists = result.body.docs;

              var resList = [];
              var res = '';

              if (vm.tenantlists != null) {
                angular.forEach(vm.tenantlists, function (item) {
                   resList = [];
                   if (item.Addr1 != undefined && !isNullOrEmpty(item.Addr1)) {
                    res = item.Addr1;
                    resList = res.split(" ");
                    item.Addr1 = resList[0] + " " + resList[1];
                   }
                });
              }
            }
          });
        } else if($window.sessionStorage['loginTenantId'] == null || $window.sessionStorage['loginTenantId'] == "" &&  $window.sessionStorage['loginTenantId'] == undefined) {

          getCnt(false);

          data.showBaseTenant = vm.showBaseTenant;
          data.mapCode= 'getTenantId';
          postApi.login(data, function (result) {
            if(result.header.status == CONSTANT.HttpStatus.OK) {
              vm.tenantlists = result.body.docs;

              console.log('d',vm.tenantlists);

              var resList = [];
              var res = '';

              if (vm.tenantlists != null) {
                angular.forEach(vm.tenantlists, function (item) {
                   resList = [];
                   if (item.Addr1 != undefined && !isNullOrEmpty(item.Addr1)) {
                    res = item.Addr1;
                    resList = res.split(" ");
                    item.Addr1 = resList[0] + " " + resList[1];
                   }
                });
              }
            }
          });
        }


      }

      function getCnt(checkSession) {
        var data = {
          mapCode: 'Tenant.getTenantSrchCnt',
          TenantNm : vm.srch.TenantNm,
          Ceo : vm.srch.Ceo,
          userkey : '',
          showBaseTenant : vm.showBaseTenant
        };

        if(checkSession) {
          data.mapCode= 'Tenant.getTenantSrchCnt';
          postApi.select(data, function (result) {
            if(result.header.status == CONSTANT.HttpStatus.OK) {
              vm.totalItems = result.body.docs[0].totalItems;
            }
          });
        } else {
          data.mapCode= 'getTenantSrchCnt';
          postApi.login(data, function (result) {
            if(result.header.status == CONSTANT.HttpStatus.OK) {
              vm.totalItems = result.body.docs[0].totalItems;
            }
          });
        }
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

      vm.pageChanged = pageChanged;
    } ]);
