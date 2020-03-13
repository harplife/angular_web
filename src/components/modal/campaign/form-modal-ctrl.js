webapp.controller('FormModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi', 'gAlert', 'gConfirm',
    function FormModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi, gAlert, gConfirm ) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getFormList = getFormList;
      vm.columnMap = {};

      (function FormModalCtrl() {
        // pagination
        vm.totalCount = 0;
        vm.currentPageNum = 1;
        vm.viewSizePerPage = CONSTANT.POPUP_PAGINATION.VIEWSIZE;
        vm.maxSize = CONSTANT.POPUP_PAGINATION.MAXSIZE;
        vm.viewSizePerPageList = CONSTANT.POPUP_PAGINATION.OPTION_VIEWSIZE;
        vm.changeViewSize = changeViewSize;
        vm.getRequestParams = getRequestParams;

        vm.FormType = toModalData.formType;
        vm.FormList = [];
        getFormList();
      })();

      function changeViewSize() {
        getFormList();
      }

      function getRequestParams() {
        var req = {
          page : vm.currentPageNum,
          viewSize : vm.viewSizePerPage,
          formType: toModalData.formType,
        }
        vm.filter = req;
        return req;
      }

      function getFormList() {
        getFormListCnt();
        var data = vm.getRequestParams();
        data.selectType = 'List';
        data.tableNm = 'form.modal';
        data.mapCode = 'Campaign2.getFormList';
        postApi.select(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {

            if (result.body.desc.length > 0) {
              vm.listColumns = result.body.desc;
              angular.forEach(vm.listColumns, function(item) {
                vm.columnMap[item.ColumnPhysicalNm] = item;
              });
            }
            if (result.body.docs.length > 0) {
              vm.FormList = result.body.docs;
            } else {
              vm.FormList = {};
            }
          }
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> user-modal-ctrl> getFormList()', status, error);
          vm.dataloader = false;
        });
      }

      function getFormListCnt() {

        var data = vm.getRequestParams();
        data.mapCode = 'Campaign2.getFormListCnt';
        postApi.select(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              vm.totalCount = result.body.docs[0];
            }
          }
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> user-modal-ctrl> getFormList()', status, error);
          vm.dataloader = false;
        });
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      function ok(Form) {
        gConfirm('', '작성된 내용이 있을경우 해당 서식으로 대체됩니다. 진행하시겠습니까?', {
          btn: '',
          fn: function () {
            $uibModalInstance.close(Form);
          }
        }, {
          btn: '',
          fn: function () {
            cancel();
          }
        });

      }

    } ]);
