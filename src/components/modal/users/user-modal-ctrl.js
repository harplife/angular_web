webapp.controller('UserModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi',
    function UserModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi ) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getUserList = getUserList;
      vm.columnMap = {};
      vm.SrchEntryDtTo = '';
      vm.SrchEntryDtFrom = '';

      vm.MobileYn = toModalData.MobileYn;
      if(toModalData.MobileYn == undefined) vm.MobileYn = false;

      (function UserModalCtrl() {
        // pagination
        vm.totalCount = 0;
        vm.currentPageNum = 1;
        vm.viewSizePerPage = CONSTANT.POPUP_PAGINATION.VIEWSIZE;
        vm.maxSize = CONSTANT.POPUP_PAGINATION.MAXSIZE;
        vm.viewSizePerPageList = CONSTANT.POPUP_PAGINATION.OPTION_VIEWSIZE;
        vm.changeViewSize = changeViewSize;
        vm.getRequestParams = getRequestParams;

        vm.UserList = [];
        getUserList();
      })();

      function changeViewSize() {
        getUserList();
      }

      function getRequestParams() {
        var req = {
          page : vm.currentPageNum,
          viewSize : vm.viewSizePerPage,
          LoginId : vm.LoginId != undefined ? vm.LoginId : '',
          UserNm : vm.UserNm != undefined ? vm.UserNm : '',
          WorkStyle : vm.WorkStyle != undefined ? vm.WorkStyle : '',
          UserGrade : vm.UserGrade != undefined ? vm.UserGrade : ''
        }
        vm.filter = req;
        return req;
      }

      function getUserList() {
        getUserListCnt();
        var data = vm.getRequestParams();
        data.selectType = 'List';
        data.tableNm = 'users';
        data.mapCode = 'User.getUserModalList';
        postApi.select(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {

            if (result.body.desc.length > 0) {
              vm.listColumns = result.body.desc;
              angular.forEach(vm.listColumns, function(item) {
                vm.columnMap[item.ColumnPhysicalNm] = item;
              });
            }
            if (result.body.docs.length > 0) {
              vm.UserList = result.body.docs;
            } else {
              vm.UserList = {};
            }
          }
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> user-modal-ctrl> getUserList()', status, error);
          vm.dataloader = false;
        });
      }

      function getUserListCnt() {

        var data = vm.getRequestParams();
        data.mapCode = 'User.getUserModalListCnt';
        postApi.select(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              vm.totalCount = result.body.docs[0];
            }
          }
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> user-modal-ctrl> getUserList()', status, error);
          vm.dataloader = false;
        });
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      function ok(User) {
        $uibModalInstance.close(User);
      }

    } ]);
