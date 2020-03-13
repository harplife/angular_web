webapp.controller('WjmSurveyModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi',
    function WjmSurveyModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi ) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getList = getList;
      vm.columnMap = {};


      (function WjmSurveyModalCtrl() {
        // pagination
        vm.totalCount = 0;
        vm.currentPageNum = 1;
        vm.viewSizePerPage = CONSTANT.POPUP_PAGINATION.VIEWSIZE;
        vm.maxSize = CONSTANT.POPUP_PAGINATION.MAXSIZE;
        vm.viewSizePerPageList = CONSTANT.POPUP_PAGINATION.OPTION_VIEWSIZE;
        vm.changeViewSize = changeViewSize;
        vm.getRequestParams = getRequestParams;

        vm.SvyList = [];
        getList();
      })();

      function changeViewSize() {
        getList();
      }

      function getRequestParams() {
        var req = {
          page : vm.currentPageNum,
          viewSize : vm.viewSizePerPage,
          SvyNm : vm.SvyNm != undefined ? vm.SvyNm : ''
        };
        vm.filter = req;
        return req;
      }

      function getList() {
        getListCnt();
        var data = vm.getRequestParams();
        data.selectType = 'List';
        data.tableNm = 'wjm.surveymodal';
        data.mapCode = 'WjmSurvey.getSurveyModalList';
        postApi.select(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {

            if (result.body.desc.length > 0) {
              vm.listColumns = result.body.desc;
              angular.forEach(vm.listColumns, function(item) {
                vm.columnMap[item.ColumnPhysicalNm] = item;
              });
            }
            if (result.body.docs.length > 0) {
              vm.SvyList = result.body.docs;
            } else {
              vm.SvyList = {};
            }
          }
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> classfyinfo-modal-ctrl> getList()', status, error);
          vm.dataloader = false;
        });
      }

      function getListCnt() {

        var data = vm.getRequestParams();
        data.mapCode = 'WjmSurvey.getSurveyModalListCnt';
        postApi.select(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              vm.totalCount = result.body.docs[0];
            }
          }
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> classfyinfo-modal-ctrl> getListCnt()', status, error);
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
