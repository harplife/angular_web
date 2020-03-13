webapp.controller('PreModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', 'gAlert', 'gConfirm',
  function PreModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi, gAlert, gConfirm) {
    var vm = this;

    // html 에서 사용하는 함수 연결
    vm.close = close;

    (function PreModalCtrl() {
      vm.srch = {
        keyId: toModalData.keyId,
      };

      vm.qstItemLists = {};
      //console.log("test", vm.srch);
      //vm.data = {};

      if (!isNullOrEmpty(vm.srch.keyId)) {
        getQstList();
      }
    })();

    /**
     * 문제 목록
     *
     * @param
     * @return
     */
    function getQstList() {
      var data = vm.srch;
      data.mapCode = 'Survey.getSurveyqstList';

      postApi.select(data, function (result) {
        if(result.header.status == CONSTANT.HttpStatus.OK) {
          vm.qstLists = result.body.docs;

          if (!isNullOrEmpty(vm.qstLists)) {
            getQstItemList(0);
          }
        }
      });
    }

    /**
     * 문제항목 목록
     *
     * @param
     * @return
     */
    function getQstItemList(idx) {
      var data = vm.srch;
      data.mapCode = 'Survey.getSurveyqstitemList';
      data.keyId2 = vm.qstLists[idx].KeyId2;

      postApi.select(data, function (result) {
        if(result.header.status == CONSTANT.HttpStatus.OK) {
          vm.qstItemLists[idx] = result.body.docs;

          idx++;
          if (vm.qstLists.length > idx) {
            getQstItemList(idx)
          }
          else {
            //console.log("tttt", vm.qstItemLists);
          }
        }
      });
    }

    /**
     * 닫기 버튼 이벤트
     *
     * @param
     * @return
     */
    function close() {
      $uibModalInstance.dismiss('close data');
    }
  } ]);
