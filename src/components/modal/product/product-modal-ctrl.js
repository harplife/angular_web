webapp.controller('ProductModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi',
    function ProductModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getList = getList;
      vm.currentPage = 1;
      vm.maxSize = 10;

      vm.srch = {
		    GoodsNm : '',
        GoodsNo : '',
        viewSize : 10,
      };

      vm.selectedTenantId = toModalData.TenantId;

      (function TenantModalCtrl() {
        getList();
      })();

      function getList() {
        getCnt();
        var data = {
          mapCode: 'Product.getProductList',
          GoodsNm : vm.srch.GoodsNm,
          userkey : '',
          page : vm.srch.page,
        };

        data.mapCode= 'Product.getProductList';
        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            vm.productlists = result.body.docs;
          }
        });
      }

      function getCnt() {
        var data = {
          mapCode: 'Product.getProductCnt',
          GoodsNm : vm.srch.GoodsNm,
          userkey : '',
        };

        data.mapCode= 'Customer.getProductCnt';
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

      function pageChanged() {
        vm.srch.page = vm.currentPage;
        getList();

      }

      vm.pageChanged = pageChanged;
    } ]);
