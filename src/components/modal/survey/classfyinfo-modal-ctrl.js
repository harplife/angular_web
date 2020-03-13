webapp.controller('ClassfyInfoModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi',
    function ClassfyInfoModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi ) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getClassfyInfoList = getClassfyInfoList;
      vm.columnMap = {};
      vm.SrchEntryDtTo = '';
      vm.SrchEntryDtFrom = '';

      vm.MobileYn = toModalData.MobileYn;
      if(toModalData.MobileYn == undefined) vm.MobileYn = false;

      vm.Manager = !isNullOrEmpty(toModalData.srchManager) ? toModalData.srchManager : "";

      (function ClassfyInfoModalCtrl() {
        // pagination
        vm.totalCount = 0;
        vm.currentPageNum = 1;
        vm.viewSizePerPage = CONSTANT.POPUP_PAGINATION.VIEWSIZE;
        vm.maxSize = CONSTANT.POPUP_PAGINATION.MAXSIZE;
        vm.viewSizePerPageList = CONSTANT.POPUP_PAGINATION.OPTION_VIEWSIZE;
        vm.changeViewSize = changeViewSize;
        vm.getRequestParams = getRequestParams;

        vm.ClassfyInfoList = [];
        getClassfyInfoList();
      })();

      function changeViewSize() {
        getClassfyInfoList();
      }

      function getRequestParams() {
        var req = {
          page : vm.currentPageNum,
          viewSize : vm.viewSizePerPage,
          ClassfyInfoNm : vm.ClassfyInfoNm != undefined ? vm.ClassfyInfoNm : '',
          Manager : vm.Manager
        };
        vm.filter = req;
        return req;
      }

      function getClassfyInfoList() {
        getClassfyInfoListCnt();
        var data = vm.getRequestParams();
        data.selectType = 'List';
        data.tableNm = 'wjm.clasfyinfo';
        data.mapCode = 'WjmSurvey.getClassfyInfoModalList';
        postApi.select(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {

            if (result.body.desc.length > 0) {
              vm.listColumns = result.body.desc;
              angular.forEach(vm.listColumns, function(item) {
                vm.columnMap[item.ColumnPhysicalNm] = item;
              });
            }
            if (result.body.docs.length > 0) {
              vm.ClassfyInfoList = result.body.docs;
            } else {
              vm.ClassfyInfoList = {};
            }
          }
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> classfyinfo-modal-ctrl> getClassfyInfoList()', status, error);
          vm.dataloader = false;
        });
      }

      function getClassfyInfoListCnt() {

        var data = vm.getRequestParams();
        data.mapCode = 'WjmSurvey.getClassfyInfoModalListCnt';
        postApi.select(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              vm.totalCount = result.body.docs[0];
            }
          }
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> classfyinfo-modal-ctrl> getClassfyInfoList()', status, error);
          vm.dataloader = false;
        });
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      function ok(ClassfyInfo) {
        $uibModalInstance.close(ClassfyInfo);
      }

    } ]);
