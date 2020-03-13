webapp.controller('CommonCodeCustomCtrl', [ '$scope', '$element', '$compile', 'GLOBAL_CONSTANT', '$translate',
  function CommonCodeCustomCtrl($scope, $element, $compile, CONSTANT, $translate) {
    var vm = this;
    vm.isDisabled = false;

    vm.codeList = {
      Code : '',
      CodeValue : ''
    };

    vm.codeModel = {};
    vm.SelectedCode = 'Y';

    vm.list = [];
    vm.data = {};
    vm.chooseMessage = 'Menu.CHOOSE';

    vm.onChangeHandler = function() {
      if (vm.callback) {
        vm.callback(vm.codeModel);
      }

      if (!vm.codeModel) {
        vm.codeModel = '';
      }

      try {
        vm.initChangeData(vm.codeModel);
      } catch (err) {
        vm.initChangeData("");
      }
    };

    vm.getSelectList = getSelectList;
    function getSelectList(codeList) {
      vm.list = [];
      angular.forEach(codeList, function (item) {
        vm.list.push(item);
      });
    }

  }
]);
