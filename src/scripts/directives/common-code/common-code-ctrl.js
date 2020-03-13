webapp.controller('CommonCodeCtrl', [ '$scope', '$element', '$compile', 'GLOBAL_CONSTANT', 'CommonAPISrv', 'postApi',
  function CommonCodeCtrl($scope, $element, $compile, CONSTANT, commonApi, postApi) {
    var vm = this;
    vm.isDisabled = false;

    vm.paramData = {
      CodeType : '',
      ParentCommonCodeId : '',
      CommonCodeId : '',
      Code : '',
      CodeValue : '',
      CallbackTarget : '',
      ReloadSeq : 0
    };

    vm.data = {};
    vm.chooseMessage = 'Menu.CHOOSE';

    vm.onChangeHandler = function() {
      if (vm.callback) {
        if (vm.data != null) {
          vm.data.CallbackTarget = vm.paramData.CallbackTarget;
          vm.callback(vm.data);
        } else {
          var data = vm.paramData;
          data.Code = '';
          vm.callback(data);
        }
      }
    };

    vm.getSelectList = getSelectList;
    function getSelectList() {
      if (vm.paramData == null || vm.paramData.CodeType == null || vm.paramData.CodeType == '') {
        vm.list = {};
        return;
      }

      angular.copy(vm.paramData, vm.data);

      vm.data.mapCode = "CommonCode.getCommonCodeList";

      var prms = postApi.select(vm.data, function(result) {
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          vm.list = result.body.docs;
        }
      }, function(error) {
        console.table(error);
      });
    }

  }
]);
