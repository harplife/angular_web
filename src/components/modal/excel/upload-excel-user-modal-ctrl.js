webapp.controller('UploadExcelUserModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi',
    function UploadExcelUserModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getList = getList;
      vm.currentPage = 1;
      vm.maxSize = 10;

      vm.srch = {
		    TenantNm : '',
        TenantId : '',
        viewSize : 10
      };

      vm.selectedTenantId = toModalData.TenantId;

      (function TenantModalCtrl() {
        getList();
      })();

      function getList() {

        var data = {
          mapCode: 'Tenant.getTenantSrch',
          TenantNm : vm.srch.TenantNm,
          userkey : '',
        };

        if($window.sessionStorage['loginTenantId']!= null && $window.sessionStorage['loginTenantId'] != "" && $window.sessionStorage['loginTenantId'] != undefined){
          data.mapCode= 'Tenant.getTenantSrch';
          postApi.select(data, function (result) {
            if(result.header.status == CONSTANT.HttpStatus.OK) {
              vm.tenantlists = result.body.docs;
              vm.totalItems = result.body.docCnt;
            }
          });
        } else if($window.sessionStorage['loginTenantId'] == null || $window.sessionStorage['loginTenantId'] == "" &&  $window.sessionStorage['loginTenantId'] == undefined) {
          data.mapCode= 'getTenantId';
          postApi.login(data, function (result) {
            if(result.header.status == CONSTANT.HttpStatus.OK) {
              vm.tenantlists = result.body.docs;
              vm.totalItems = result.body.docCnt;
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
    } ]);
