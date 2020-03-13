webapp.controller('WjmFormModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi',
  function WjmFormModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi ) {
    var vm = this;
    vm.cancel = cancel;
    vm.ok = ok;
    vm.getList = getList;
    vm.columnMap = {};

    (function WjmFormModalCtrl() {
      // pagination
      vm.totalCount = 0;
      vm.currentPageNum = 1;
      vm.viewSizePerPage = CONSTANT.POPUP_PAGINATION.VIEWSIZE;
      vm.maxSize = CONSTANT.POPUP_PAGINATION.MAXSIZE;
      vm.viewSizePerPageList = CONSTANT.POPUP_PAGINATION.OPTION_VIEWSIZE;
      vm.changeViewSize = changeViewSize;
      vm.getRequestParams = getRequestParams;

      vm.lists = [];
      getList();
    })();

    function changeViewSize() {
      getList();
    }

    function getRequestParams() {
      var req = {
        page : vm.currentPageNum,
        viewSize : vm.viewSizePerPage,
        FormNm : vm.FormNm != undefined ? vm.FormNm : '',
        FormType : '100' // 설문유형이 설문인 것만
      };
      vm.filter = req;
      return req;
    }

    function getList() {
      getListCnt();
      var data = vm.getRequestParams();
      data.selectType = 'List';
      data.tableNm = 'wjm.form';
      data.mapCode = 'WjmForm.getFormList';
      postApi.select(data, function(result){
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          /*
          if (result.body.desc.length > 0) {
            vm.listColumns = result.body.desc;
            angular.forEach(vm.listColumns, function(item) {
              vm.columnMap[item.ColumnPhysicalNm] = item;
            });
          }
          */

          if (result.body.docs.length > 0) {
            vm.lists = result.body.docs;
          } else {
            vm.Lists = {};
          }
        }
        vm.dataloader = false;
      }, function(error) {
        console.error('Error> wjm-form-modal-ctrl> getList()', status, error);
        vm.dataloader = false;
      });
    }

    function getListCnt() {

      var data = vm.getRequestParams();
      data.mapCode = 'WjmForm.getFormListCnt';
      postApi.select(data, function(result){
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length > 0) {
            vm.totalCount = result.body.docs[0];
          }
        }
        vm.dataloader = false;
      }, function(error) {
        console.error('Error> wjm-form-modal-ctrl> getListCnt()', status, error);
        vm.dataloader = false;
      });
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel data');
    }

    function ok(item) {
      $uibModalInstance.close(item);
    }

  } ]);
