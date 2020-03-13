webapp.controller('SvyTypeModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi',
    function SvyTypeModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi ) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getSvyTypeList = getSvyTypeList;
      vm.columnMap = {};
      vm.SrchEntryDtTo = '';
      vm.SrchEntryDtFrom = '';

      vm.MobileYn = toModalData.MobileYn;
      if(toModalData.MobileYn == undefined) vm.MobileYn = false;

      (function SvyTypeModalCtrl() {
        // pagination
        vm.totalCount = 0;
        vm.currentPageNum = 1;
        vm.viewSizePerPage = CONSTANT.POPUP_PAGINATION.VIEWSIZE;
        vm.maxSize = CONSTANT.POPUP_PAGINATION.MAXSIZE;
        vm.viewSizePerPageList = CONSTANT.POPUP_PAGINATION.OPTION_VIEWSIZE;
        vm.changeViewSize = changeViewSize;
        vm.getRequestParams = getRequestParams;

        vm.SvyTypeList = [];
        getSvyTypeList();
      })();

      function changeViewSize() {
        getSvyTypeList();
      }

      function getRequestParams() {
        var req = {
          page : vm.currentPageNum,
          viewSize : vm.viewSizePerPage,
          SvyTypeNm : vm.SvyTypeNm != undefined ? vm.SvyTypeNm : ''
        };
        vm.filter = req;
        return req;
      }

      function getSvyTypeList() {
        getSvyTypeListCnt();
        var data = vm.getRequestParams();
        data.selectType = 'List';
        data.tableNm = 'wjm.surveytype';
        data.mapCode = 'WjmSurvey.getSvyTypeModalList';
        postApi.select(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {

            if (result.body.desc.length > 0) {
              vm.listColumns = result.body.desc;
              angular.forEach(vm.listColumns, function(item) {
                vm.columnMap[item.ColumnPhysicalNm] = item;
              });
            }
            if (result.body.docs.length > 0) {
              vm.SvyTypeList = result.body.docs;
            } else {
              vm.SvyTypeList = {};
            }
          }
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> classfyinfo-modal-ctrl> getSvyTypeList()', status, error);
          vm.dataloader = false;
        });
      }

      function getSvyTypeListCnt() {

        var data = vm.getRequestParams();
        data.mapCode = 'WjmSurvey.getSvyTypeModalListCnt';
        postApi.select(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              vm.totalCount = result.body.docs[0];
            }
          }
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> classfyinfo-modal-ctrl> getSvyTypeList()', status, error);
          vm.dataloader = false;
        });
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      function ok(SvyType) {
        $uibModalInstance.close(SvyType);
      }

    } ]);
