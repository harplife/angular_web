webapp.controller('UserroleModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi',
    function UserroleModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi) {
      var vm = this;

      vm.UserRoles = [];
      if (!isNullOrEmpty(toModalData.UserRoles))
        vm.UserRoles = toModalData.UserRoles;

      vm.data = {list:[]};

      vm.cancel = cancel;
      vm.ok = ok;
      vm.getList = getList;
      vm.IsRole = IsRole;
      vm.addRole = addRole;
      vm.querySearch = querySearch;
      vm.onRemoveChip = onRemoveChip;
      vm.filterSelected = true;

      (function UserroleModalCtrl() {
        // search
        vm.searchValue = '';
        vm.selectPeriod = 'all';
        vm.startDate = '';
        vm.endDate = '';
        // pagination
        vm.totalCount = 0;
        vm.currentPageNum = 1;
        vm.viewSizePerPage = CONSTANT.POPUP_PAGINATION.VIEWSIZE;
        vm.maxSize = CONSTANT.POPUP_PAGINATION.MAXSIZE;
        vm.viewSizePerPageList = CONSTANT.POPUP_PAGINATION.OPTION_VIEWSIZE;
        // 검색 선택 옵션
        vm.searchFieldTypeList = [ {
          optionId : 'UserNm',
          optionName : '이름'
        } ];
        vm.searchFieldType = vm.searchFieldTypeList[0].optionId;
        vm.changeViewSize = changeViewSize;
        vm.getRequestParams = getRequestParams;

        vm.list = [];
        getList();
      })();
      function changeViewSize() {
        getList();
      }
      function getRequestParams() {
        var req = {
          page : vm.currentPageNum,
          viewSize : vm.viewSizePerPage,
          searchFieldType : vm.searchFieldType,
          RoleNm : vm.searchValue,
          selectPeriod : vm.selectPeriod,
          TenantId : toModalData.TenantId
        };
        vm.filter = req;
        return req;
      }

      function getList() {
        getListCnt();

        var data = vm.getRequestParams();
        data.mapCode = 'Role.getRoleList';

        postApi.select(data, function(result) {
          if (result.header.status == CONSTANT.HttpStatus.OK) {
            if (result.body.docCnt > 0) {
              vm.data.list = result.body.docs;
            } else {
              vm.totalCount = 0;
            }
          }
        }, function(error) {
          console.error('Error-getList', status, data);
        });
      }

      function getListCnt() {
        var data = vm.getRequestParams();
        data.mapCode = 'Role.getRoleListCnt';

        postApi.select(data, function(result) {
          if (result.header.status == CONSTANT.HttpStatus.OK) {
            if (result.body.docCnt > 0) {
              vm.totalCount = result.body.docs[0];
            }
          }
        }, function(error) {
          console.error('Error-getList', status, data);
        });
      }

      function IsRole(role) {

        if(vm.UserRoles != null && vm.UserRoles != undefined && vm.UserRoles != ""){

          for (i = 0; i < vm.UserRoles.length; i++) {
            if (role.RoleId == vm.UserRoles[i].RoleId)
              return true;
          }
        }
        return false;
      }

      function addRole(RoleId) {
        for (var i = 0; i < vm.data.list.length; i++) {
          if (vm.data.list[i].RoleId == RoleId) {
            vm.UserRoles.push(vm.data.list[i]);
            break;
          }
        }
      }

      /**
       * Search for contacts.
       */
      function querySearch(query) {
        var results = query ? vm.data.list.filter(createFilterFor(query)) : [];
        return results;
      }
      /**
       * Create filter function for a query string
       */
      function createFilterFor(query) {
        return function filterFn(role) {
          return (role.RoleNm.indexOf(query) != -1);
        };
      }

      function onRemoveChip(item) {
        console.log('item=', item);
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      function ok() {
        $uibModalInstance.close(vm.UserRoles);
      }

    } ]);
