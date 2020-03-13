webapp.controller('UdcSearchCtrl', [ '$scope', '$element', '$compile', 'GLOBAL_CONSTANT', '$translate', '$filter',
  function UdcSearchCtrl($scope, $element, $compile, CONSTANT, $translate, $filter) {
    var vm = this;
    vm.disabled = false;
    vm.metaList = [];
    vm.metaModel = [];

    vm.initalized = false;
    vm.chooseMessage = 'Menu.CHOOSE';

    vm.onModelChanged = function() {
      if (!vm.initalized) return;

      try {
        vm.initChangeData(vm.metaModel);
      } catch (err) {
        vm.initChangeData("");
      }
    };

    vm.onDateChanged = function(ColumnPhysicalNm, index) {
//    vm.metaModel[ColumnPhysicalNm] = $filter('date')(vm.RegDate[index], 'yyyy-MM-dd', 'UTC');
      vm.metaModel[ColumnPhysicalNm] = (new Date(vm.RegDate[index])).getTime();
      vm.onModelChanged();
    };
  }
]);
