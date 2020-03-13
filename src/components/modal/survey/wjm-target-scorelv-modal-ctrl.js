webapp.controller('TargetScoreLvModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi', 'gAlert', '$rootScope', 'modalFactory', 'gConfirm', '$filter', '$translate',
  function TargetScoreLvModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi, gAlert, $rootScope, modalFactory, gConfirm, $filter, $translate) {

    var vm = this;
    vm.dataloader = false;

    var LIST_SQL = 'WjmReport.getTargetScoreLvList';

    vm.srch = {
      keyId : toModalData.keyId,
      SvyTypeId : toModalData.SvyTypeId
    };
    vm.lists = [];

    // 조회
    function getList() {

      vm.dataloader = true;

      var data = vm.srch;
      data.mapCode = LIST_SQL;
      postApi.select(data, function (result) {

        if (result.header.status === CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length > 0) {
            vm.lists = result.body.docs;
          } else {
            vm.lists = [];
          }
        }
        vm.dataloader = false;
      }, function(error) {
        console.error('Error-getList', status, data);
        vm.dataloader = false;
      });
    }



    // 닫기
    function closeWin() {
      $uibModalInstance.close();
    }


    // 함수 선언
    vm.getList = getList;
    vm.closeWin = closeWin;

    getList();

  }, ]);
