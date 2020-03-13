webapp.controller('DataGroupActionModalCtrl', [ '$window', '$scope', '$rootScope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', '$filter',
    function DataGroupActionModalCtrl($window, $scope, $rootScope, $uibModalInstance, toModalData, CONSTANT, postApi, $filter) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.select = select;
      vm.getDatagroupList = getDatagroupList;
      vm.selectedLi = {};
      console.log('toModalData=', toModalData);

      (function DataGroupActionModalCtrl() {
        // search
        // pagination
        vm.GroupAndAction = $rootScope.gVariable.dataGroupId + "." + $rootScope.gVariable.dataActionId;
        getDatagroupList();
      })();

      function getDatagroupList() {
        var data = {};
        data.mapCode = 'MaDatagroup.getDatagroupAndActionList';

        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            vm.dagrouplists = result.body.docs;
          }
        });
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      function ok() {
        if (toModalData.UpdateDefault != null && toModalData.UpdateDefault == false) {
          $uibModalInstance.close(vm.selectedLi);
          return;
        }
        var daId = vm.GroupAndAction.split('.');
        var data = {};
        data.DatagroupId = daId[0];
        data.ActionId = daId[1];
        data.mapCode = 'MaDatagroup.updateDefaultDatagroupActionDetail';

        postApi.update(data, function (result) {
          vm.dataloader = false;
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            angular.forEach(vm.dagrouplists, function(item) {
              if (data.DatagroupId == item.Code) {
                data.DatagroupNm = item.DataNm;
              }

              if (data.ActionId == item.Code) {
                data.ActionNm = item.DataNm + ' (' + $filter('utcToLocal')(item.BeginDate,'yyyy-MM-dd') + '~' + $filter('utcToLocal')(item.EndDate,'yyyy-MM-dd') + ')';
              }
            });
            $uibModalInstance.close(data);
          }
        });
      }

      function select(li) {
        vm.selectedLi = li;
        console.log('vm.selectedLi=', vm.selectedLi);
      }

    } ]);
