webapp.controller('WjmSurveyMultiselModalCtrl', [ '$window', '$rootScope', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi', 'gAlert', 'modalFactory',
    function WjmSurveyMultiselModalCtrl($window, $rootScope, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi, gAlert, modalFactory ) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getList = getList;
      vm.columnMap = {};


      (function WjmSurveyMultiselModalCtrl() {
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
          SvyNm : vm.SvyNm != undefined ? vm.SvyNm : '',
          FormId : vm.FormId,
          isResult : toModalData.isResult // 진행중, 완료 상태만 조회하기 위한 조건 Y/N
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
              vm.lists = result.body.docs;
            } else {
              vm.lists = {};
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

      function ok() {

        if (vm.lists.length == undefined || vm.lists.length == 0) {
          gAlert("", "데이터가 없습니다.");
          return false;
        }

        var srchChk = {};
        srchChk.FormId = '';
        srchChk.SvyId = '';
        srchChk.SvyTypeId = '';
        srchChk.ClassfyInfoId = '';
        srchChk.KeyIdList = [];
        srchChk.SvyNms = '';
        srchChk.TgtCnt = 0;

        for (var i = 0; i < vm.lists.length; i++) {
          if (vm.lists[i].chkRow) {

            if(srchChk.FormId == '') {
              srchChk.FormId = vm.lists[i].FormId;
              srchChk.SvyId = vm.lists[i].SvyId;
              srchChk.SvyTypeId = vm.lists[i].SvyTypeId;
              srchChk.ClassfyInfoId = vm.lists[i].ClassfyInfoId;
            }
            if(srchChk.KeyIdList.length >= 1 && isNullOrEmpty(srchChk.FormId)){
              gAlert("", "서식을 사용하지 않은 설문의 경우 다른 설문과 함께 선택할 수 없습니다.");
              return false;
            }
            if(srchChk.FormId != vm.lists[i].FormId){
              gAlert("", "동일한 서식을 사용하는 설문 내에서 체크해 주세요.");
              return false;
            }

            srchChk.KeyIdList.push(vm.lists[i].SvyId);
            srchChk.SvyNms = srchChk.SvyNms +(srchChk.SvyNms == ''? '' : ', ')+ vm.lists[i].SvyNm;
            srchChk.TgtCnt = srchChk.TgtCnt + vm.lists[i].TgtCnt;
          }
        }
        if (srchChk.KeyIdList == null || srchChk.KeyIdList.length == 0) {
          gAlert('', '항목을 선택해 주세요.');
          return false;
        }

        $uibModalInstance.close(srchChk);
      }

      // 목록 체크박스 로직 설정
      function setInitData() {
        vm.chkHead = false;
        $scope.chkRowChg = function (row) {

          // 행 클릭하여 체크
          if(!isNullOrEmpty(row)) row.chkRow = true;

          for (var i = 0; i < vm.lists.length; i++) {
            if (!vm.lists[i].isChecked) {
              vm.chkHead = false;
              return;
            }
          }
          vm.chkHead = true;
        };
        $scope.chkHeadChg = function () {
          for (var i = 0; i < vm.lists.length; i++) {
            vm.lists[i].chkRow = vm.chkHead;
          }
        };
      }

      // 서식
      vm.srchFormModal = function () {
        var ctrl = 'WjmFormModalCtrl as modalCtrl';
        var paramData = {srchTenantId: $rootScope.gVariable.srchTenantId};
        var modalInstance = modalFactory.open('xs', 'components/modal/survey/wjm-form-modal.html', ctrl, paramData);
        modalInstance.result.then(function (okData) {
          vm.FormNm = okData.FormNm;
          vm.FormId = okData.KeyId;
        }, function (cancelData) {
        });
      };
      vm.eraseForm = function () {
        vm.FormNm = "";
        vm.FormId = "";
      };

      setInitData();

    } ]);
