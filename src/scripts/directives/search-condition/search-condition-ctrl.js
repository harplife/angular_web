webapp.controller('SearchConditionCtrl', [ '$scope', '$element', '$compile', 'GLOBAL_CONSTANT',
  function SearchConditionCtrl($scope, $element, $compile, CONSTANT) {
    var vm = this;

    vm.searchCoditionStr = "";
    vm.columnMap = null;
    vm.srch = "";
    vm.count = 0;
    vm.countStr = "0";

    vm.updateSearchCoditionStr = function() {
      console.log(vm.count);
      console.log(vm.columnMap);
      console.log(vm.srch);

      vm.countStr = vm.count? vm.count : 0;
      vm.searchConditionStr = "";

      if (vm.columnMap == null)
        return;

      for (var key2 in vm.columnMap) {
        console.log(key2);
      }

      var str = [];
      for (var key in vm.srch) {
        if (key == 'page' || key == 'viewSize' || key == 'tableNm' || key == 'sortDirect' || key == 'sortColumn' || key == 'userkey' || key == 'selectType' || key == 'srchTenantId')
          continue;

        var name = key;
        var value = vm.srch[key];

        console.log(key);

        if (vm.columnMap[key]) {
          name = vm.columnMap[key].ColumnLogicalNm;

          console.log(name, value);

          if (vm.columnMap[key].ColumnLogicalDataType == "50") {
            if (vm.columnMap[key].CodeList) {
              vm.columnMap[key].CodeList.forEach(function (v) {
                if (v.Code == value) {
                  value = v.CodeValue;
                  return;
                }
              });
            }
          }
        }

        str.push(name + ':' + value);
      }

      vm.searchConditionStr += str.join(',');
    };
  }
]);
