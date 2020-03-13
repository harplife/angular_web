webapp.controller('UdcDetailCtrl', [ '$scope', '$element', '$compile', 'GLOBAL_CONSTANT', '$translate', '$filter',
  function UdcDetailCtrl($scope, $element, $compile, CONSTANT, $translate, $filter) {
    var vm = this;
    vm.disabled = false;
    vm.metaList = [];
    vm.metaModel = [];
    vm.initalized = false;
  }
]);
