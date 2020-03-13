webapp.controller('ContentsModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi', 'gAlert',
    function ContentsModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi, gAlert ) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;

      vm.Contents = toModalData.Contents;

      (function ContentsModalCtrl() {

      })();

      function ok() {
        $uibModalInstance.close();
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

    } ]);
