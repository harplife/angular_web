webapp.controller('SelectDataGroupCtrl', [ '$scope', '$rootScope', '$element', '$compile', '$filter', 'GLOBAL_CONSTANT', 'modalFactory', 'postApi',
  function SelectDataGroupCtrl($scope, $rootScope, $element, $compile, $filter, CONSTANT, modalFactory, postApi) {
    var vm = this;

    vm.DatagroupNm = $rootScope.gVariable.dataGroupNm;
    vm.ActionNm = $rootScope.gVariable.dataActionNm;

    vm.changeDatagroup = changeDatagroup;

    function changeDatagroup() {
      var ctrl = 'DataGroupActionModalCtrl as vc';
      var paramData = {};

      // 부서 검색 팝업 호출
      var modalInstance = modalFactory.open('modal', 'components/modal/dataanalysis/data-group-action-modal.html', ctrl, paramData);

      modalInstance.result.then(function (okData) {
        $rootScope.setGVariable('dataGroupId', okData.DatagroupId);
        $rootScope.setGVariable('dataActionId', okData.ActionId);
        $rootScope.setGVariable('dataGroupNm', okData.DatagroupNm);
        $rootScope.setGVariable('dataActionNm', okData.ActionNm);
        vm.DatagroupNm = okData.DatagroupNm;
        vm.ActionNm = okData.ActionNm;

        if (vm.codeChanged) {
          vm.codeChanged();
        }
      }, function (cancelData) {
        // 취소
      });
    }
  }
]);
