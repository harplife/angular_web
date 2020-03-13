webapp.controller('WjmUrlPostModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', 'gAlert', 'gConfirm', '$filter',
  function WjmUrlPostModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi, gAlert, gConfirm, $filter) {
    var vm = this;

    // html 에서 사용하는 함수 연결
    vm.close = close;

    (function WjmUrlPostModalCtrl() {
      vm.data = {};
      vm.srch = {
        keyId: toModalData.keyId
      };

      // 데이터 삽입
      vm.data.SvyUrl = "https://salevis.net/#/survey/" + vm.srch.keyId + "/";
      vm.data.SvyUrlLink = "<a href=\"" + vm.data.SvyUrl + "\" target=\"_blank\">설문참여하기</a>";
      vm.data.SvyUrlCode = "<iframe width=\"1000\" height=\"600\" src=\"" + vm.data.SvyUrl + "\" frameborder=0></iframe>";
    })();

    /**
     * 닫기 버튼 이벤트
     *
     * @param
     * @return
     */
    function close() {
      $uibModalInstance.dismiss('cancel data');
    }
  } ]);
