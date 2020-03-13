webapp.controller('CareTktModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi',
    function CareTktModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getList = getList;
      vm.currentPage = 1;
      vm.maxSize = 10;

      vm.srch = {
		    ProductNm : '',
        ProductId : '',
        viewSize : 10,
      };

      vm.selectedTenantId = toModalData.TenantId;

      (function CareTktModalCtrl() {
        getList();
      })();

      function getList() {
        getCnt()
        var data = {
          mapCode: 'Caretkt.getCareTktListModal',
          CareTktNm : vm.srch.CareTktNm,
          Remark : vm.srch.Remark,
          page : vm.srch.page,
          userkey : '',
        };

        data.mapCode= 'Caretkt.getCareTktListModal';
        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            vm.careTktlists = result.body.docs;
          }
        });
      }

      function getCnt() {
        var data = {
          mapCode: 'Caretkt.getCareTktListModalCnt',
          CareTktNm : vm.srch.CareTktNm,
          Remark : vm.srch.Remark,
          userkey : '',
        };

        data.mapCode= 'Caretkt.getCareTktListModalCnt';
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
