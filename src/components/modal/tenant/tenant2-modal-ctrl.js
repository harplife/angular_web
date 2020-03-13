webapp.controller('Tenant2ModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi',
    function Tenant2ModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getList = getList;
      vm.currentPage = 1;
      vm.maxSize = 10;


      vm.srch = {
		    TenantNm : '',
        TenantId : toModalData.TenantId,
        viewSize : 10
		  };

      (function TenantModalCtrl() {
        getList();
      })();


      function getList() {
        var data = {
          mapCode: 'Tenant.getTenantSrch', TenantNm : vm.srch.TenantNm, TenantId : toModalData.TenantId
        };
        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            vm.tenantlists = result.body.docs;
            vm.totalItems = result.body.docCnt;

          }
        });
      }


      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      function ok(item) {
        $uibModalInstance.close(item);
      }
    } ]);
