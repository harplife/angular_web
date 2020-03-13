webapp.controller('DataGroupModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi',
    function DataGroupModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.select = select;
      vm.getShopList = getShopList;
      vm.selectedLi = {};
      console.log('toModalData=', toModalData);

      (function DataGroupModalCtrl() {
        // search
        vm.searchValue = '';
        vm.selectPeriod = 'all';
        vm.startDate = '';
        vm.endDate = '';
        // pagination
        vm.totalCount = 0;
        vm.currentPageNum = 1;
        vm.viewSizePerPage = CONSTANT.POPUP_PAGINATION.VIEWSIZE;
        vm.maxSize = CONSTANT.POPUP_PAGINATION.MAXSIZE;
        vm.viewSizePerPageList = CONSTANT.POPUP_PAGINATION.OPTION_VIEWSIZE;
        // 검색 선택 옵션
        vm.searchFieldTypeList = [ {
          optionId : 'ActionNm',
          optionName : '이름'
        } ];
        vm.searchFieldType = vm.searchFieldTypeList[0].optionId;
        vm.changeViewSize = changeViewSize;
        vm.getRequestParams = getRequestParams;

        vm.ShopList = [];
        getShopList();
      })();
      function changeViewSize() {
        getShopList();
      }
      function getRequestParams() {
        var req = {
          page : vm.currentPageNum,
          viewSize : vm.viewSizePerPage,
          searchFieldType : vm.searchFieldType,
          MLShopNm : vm.searchValue,
          selectPeriod : vm.selectPeriod
        }
        vm.filter = req;
        return req;
      }

      function getShopList() {
        getShopListCnt();

        var data = vm.getRequestParams();
        data.mapCode = 'MaDatagroup.getDatagroupList';

        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            vm.ShopList = result.body.docs;
          }
        });
      }

      function getShopListCnt() {
        var data = vm.getRequestParams();
        data.mapCode = 'MaDatagroup.getDatagroupCount';

        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            vm.totalCount = result.body.docs[0];
          }
        });
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      function ok() {
        if (toModalData.UpdateDefault != null && toModalData.UpdateDefault == false) {
          $uibModalInstance.close(vm.selectedLi);
          return;
        }
        var data = angular.copy(vm.selectedLi);
        data.mapCode = 'MaDatagroup.updateDefaultDatagroupDetail';

        postApi.update(data, function (result) {
          vm.dataloader = false;
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            $uibModalInstance.close(vm.selectedLi);
          }
        });
      }

      function select(li) {
        vm.selectedLi = li;
        console.log('vm.selectedLi=', vm.selectedLi);
      }

    } ]);
