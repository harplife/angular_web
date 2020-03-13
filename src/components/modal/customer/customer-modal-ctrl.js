webapp.controller('CustomerModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi',
    function CustomerModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getList = getList;
      vm.currentPage = 1;
      vm.maxSize = 10;

      vm.srch = {
		    CustNm : '',
        Mobile : '',
        viewSize : 10,
      };

      vm.selectedTenantId = toModalData.TenantId;

      (function CustomerModalCtrl() {
        getList();
      })();

      function getList() {
        getCnt();
        var data = {
          mapCode: 'Customer.getCustomerModalList',
          CustNm : vm.srch.CustNm,
          Mobile : vm.srch.Mobile,
          userkey : '',
          page : vm.srch.page
        };

        data.mapCode= 'Customer.getCustomerModalList';
        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            vm.customerlists = result.body.docs;
          }
        });
      }

      function getCnt() {
        var data = {
          mapCode: 'Customer.getCustomerModalListCnt',
          CustNm : vm.srch.CustNm,
          Mobile : vm.srch.Mobile,
          userkey : '',
        };

        data.mapCode= 'Customer.getCustomerModalListCnt';
        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            vm.totalItems = result.body.docs[0].totalItems;
          }
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

      vm.pageChanged = pageChanged;
    } ]);
