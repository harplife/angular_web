webapp.controller('ColumnAttrSetupCtrl', ['$scope', '$uibModalInstance', 'SystemCodeAPISrv', 'GLOBAL_CONSTANT', 'toModalData',
  function ColumnAttrSetupCtrl($scope, $uibModalInstance, systemCodeAPISrv, CONST, toModalData) {
    var vm = this;
    var backupColumn = {};
    vm.isSizableData = isSizableData;
    vm.onCancelClick = onCancelClick;
    vm.onAddClick = onAddClick;

    (function ColumnAttrSetupCtrl(){
      getSystemCodeList();
      vm.column = toModalData;
      angular.copy(toModalData, backupColumn);
      vm.selectedPhysicalDataType = {
          code: vm.column.columnPhysicalDataType
      };
      vm.selectedLogicalDataType = {
          code: vm.column.columnLogicalDataType
      };
      vm.title = vm.column.columnLogicalNm + "(" + vm.column.columnPhysicalNm + ")";
    })();

    function onCancelClick(){
      angular.copy(backupColumn, vm.column);
        $uibModalInstance.dismiss('cancel');
    }

    function onAddClick(){
      vm.column.columnPhysicalDataType = vm.selectedPhysicalDataType.code;
      vm.column.columnLogicalDataType = vm.selectedLogicalDataType.code;

      $uibModalInstance.close(vm.column);
    }

    function getSystemCodeList(){
      systemCodeAPISrv.getSystemCodeList().getList({parentCommonCodeId:CONST.CODE_GROUP.COLUMN_DATA_TYPE}).$promise
      .then(function(json){
        vm.codeList = json.responseVO.body.docs;
      });
    }

    function isSizableData(){
      return ['40', '50'].indexOf(vm.selectedPhysicalDataType.code) < 0;
    }
  }]);
