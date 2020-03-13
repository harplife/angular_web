webapp.controller('BoardMngDetailCtrl', [ '$scope', '$state', '$stateParams', 'BoardMngAPISrv', 'postApi', 'modalFactory', 'GLOBAL_CONSTANT', 'gAlert', '$rootScope','$location','$window','gConfirm','$translate',
    function BoardMngDetailCtrl($scope, $state, $stateParams, boardMngApi, postApi, modalFactory, CONSTANT, gAlert, $rootScope,$location,$window,gConfirm,$translate) {

      var vm = this;
      vm.COLUMN_EDIT_STATE_DELETE = 'D';
      vm.COLUMN_EDIT_STATE_ADD = 'A';
      vm.COLUMN_EDIT_STATE_MODIFY = 'M';
      vm.COLUMN_EDIT_STATE_PENDING = '';
      vm.saveMetaTable = saveMetaTable;
      vm.addColumn = addColumn;
      vm.deleteColumn = deleteColumn;
      vm.openAttrSetup = openAttrSetup;
      vm.openSortMetaColumn = openSortMetaColumn;
      vm.showColumnInfo = showColumnInfo;
      vm.goModifyMetaTable = goModifyMetaTable;
      vm.checkStateChange = checkStateChange;
      vm.showFieldNameRule = showFieldNameRule;
      vm.getTableColumns = getTableColumns;
      $scope.srchTenantId = $window.sessionStorage['srchTenantId'];
      vm.deleteColumns = [];
      vm.metaColumnYN = 'N';

      (function BoardMngDetailCtrl() {
        console.info('currentActionView:', $stateParams.currentActionView);
        vm.currentActionView = $stateParams.currentActionView;
        if (angular.isDefined($stateParams.tableNm)) {
          getMetaTableDetail();
        } else {
          vm.metaTable = {
            metaTableId : '',
            tableNm : '',
            moduleType : '',
            tableDesc : '',
            metaColumns : [],
          };
          vm.usingTableId = '';
          $scope.$watch(function() {
            return vm.metaTable.tableNm;
          }, checkTableNm);
        }

      })();

      function getMetaTableDetail() {
        var res = boardMngApi.getBoardMngApi().get({
          tableNm : $stateParams.tableNm,
          srchTenantId : $window.sessionStorage['srchTenantId']
        }).$promise;
        res.then(function(json) {
          vm.metaTable = json.responseVO.body.docs[0];
          vm.metaTable.metaColumns.forEach(function(elm, idx) {
            elm.columnValid = true;
            elm.dirty = vm.COLUMN_EDIT_STATE_PENDING;
          });

          if(json.responseVO.body.docs[0].metaColumns.length > 0)
            vm.metaColumnYN = 'Y';
        });
      }

      function addColumn() {
        var newLine = {
          metaColumnId : '',
          columnPhysicalNm : '',
          columnLogicalNm : '',
          columnSection : '',
          columnPhysicalDataType : '10',
          columnLogicalDataType : '10',
          columnPhysicalDataSize : '',
          listColumnWidth : '20%',
          listColumnTextAlign : 'text-center',
          listColumnSort : vm.metaTable.metaColumns.length + 1,
          listColumnShowYN : 'Y',
          listColumnShowLevel : '3',
          editColumnWidth : 'col-lg-4 col-md-6',
          editColumnSort : vm.metaTable.metaColumns.length + 1,
          editColumnShowYN : 'Y',
          editColumnHeight : '',
          columnDesc : '',
          columnCodeValue : '',
          customColumnYN : 'Y',
          keyColumnYN : 'Y',
          dirty : vm.COLUMN_EDIT_STATE_ADD,
          columnValid : false,
        };
        vm.metaTable.metaColumns.push(newLine);
      }

      function checkStateChange(column) {
        if (column.dirty != vm.COLUMN_EDIT_STATE_ADD)
          column.dirty = vm.COLUMN_EDIT_STATE_MODIFY;
      }

      function checkTableNm(nval, oval) {
        if (angular.isUndefined(nval) || nval == '') {
          return;
        }

        var res = boardMngApi.getUsingMetaTableNm().post({
          tableNm : nval
        }).$promise;
        res.then(function(json) {
          if (json.responseVO.body.docs.length > 0) {
            vm.usingTableNm = json.responseVO.body.docs[0].tableNm;
          } else {
            vm.usingTableNm = '';
          }
        });
      }

      function saveMetaTable() {
        if(vm.metaColumnYN == 'N'){
          vm.currentActionView = 'add';
        }
        var data = vm.metaTable;
        data.currentActionView = vm.currentActionView;
        if(vm.currentActionView == 'modify') {
          postApi.sendPostApi('api/boardmng/metatables', vm.metaTable.tableNm, data, function(result){
            if (result.header.status === CONSTANT.HttpStatus.OK) {
              console.log('result.header.status');
              if (result.body.docs.length > 0) {
                gAlert('','Menu.SAVED');
                goModifyMetaTable();
              } else {
                gAlert('failed to save');
              }
            }
          }, function(error) {
            console.error('Error> h0102-list-ctrl> getList()', status, error);
          });
        }else if(vm.currentActionView == 'add'){
          $stateParams.tableNm = vm.metaTable.tableNm;
          data.deleteColumns = vm.deleteColumns;
          postApi.sendPostApi('api/boardmng/metatables', vm.metaTable.tableNm, data, function(result){
            if (result.header.status === CONSTANT.HttpStatus.OK) {
              if (result.body.docs.length > 0) {
                gAlert('','Menu.SAVED');
                goModifyMetaTable();
              } else {
                gAlert('failed to save');
              }
            }
          }, function(error) {
            console.error('Error> h0102-list-ctrl> getList()', status, error);
          });
        }
      }

      function saveAction(promise) {
        promise.then(function(json) {
          goModifyMetaTable();
        });
      }

      function deleteColumn(selectedColumn) {
        if (selectedColumn.dirty == vm.COLUMN_EDIT_STATE_PENDING || selectedColumn.dirty == vm.COLUMN_EDIT_STATE_MODIFY) {
          selectedColumn.dirty = vm.COLUMN_EDIT_STATE_DELETE;
        } else {
          vm.metaTable.metaColumns.splice(vm.metaTable.metaColumns.indexOf(selectedColumn), 1);
        }
      }

      function openAttrSetup(column) {
        if (column.columnLogicalNm == '' && column.columnPhysicalNm == '') {
          gAlert('', 'Menu.EM710VA04');
          return;
        }
        var modalInstance = modalFactory.open('lg', 'app/boardmng/modal-attr-setup.html', 'ColumnAttrSetupCtrl as modalCtrl', column);
        modalInstance.result.then(function(result) {
          if (result.dirty == vm.COLUMN_EDIT_STATE_PENDING) {
            result.dirty = vm.COLUMN_EDIT_STATE_MODIFY;
          }
          result.columnValid = true;
        });
      }

      function openSortMetaColumn() {
        if (isEmptyColumnNm()) {
          gAlert('', 'Menu.EM710VA05');
        } else {
          var delColumns = [];
          var columns = vm.metaTable.metaColumns.filter(function(elm, idx) {
            if (elm.dirty == vm.COLUMN_EDIT_STATE_DELETE) {
              delColumns.push(elm);
            }
            return elm.dirty != vm.COLUMN_EDIT_STATE_DELETE;
          });
          var modalInstance = modalFactory.open('md', 'app/boardmng/modal_attr_reorder.html', 'ColumnAttrReorderCtrl as reorderCtrl', columns);
          modalInstance.result.then(function(result) {
            vm.metaTable.metaColumns = [];
            angular.copy(result, vm.metaTable.metaColumns);
            delColumns.forEach(function(elm, idx) {
              vm.metaTable.metaColumns.push(elm);
            });
          });
        }
      }

      function showColumnInfo(column) {
        var modalInstance = modalFactory.open('lg', 'app/boardmng/modal-attr-detail.html', 'ColumnAttrSetupCtrl as modalCtrl', column);
      }

      function showFieldNameRule() {
        var modalInstance = modalFactory.open('fn', 'app/boardmng/modal_attr_fieldnamerule.html', 'ColumnAttrReorderCtrl as reorderCtrl', '');
      }

      function isEmptyColumnNm() {
        vm.metaTable.metaColumns.forEach(function(item, indx) {
          if (item.columnLogicalNm == null || item.columnLogicalNm.trim() == '') {
            return true;
          }
        });
        return false;
      }

      function getTableColumns() {
        if(vm.metaColumnYN == 'Y') {
          gConfirm('', $translate.instant('Menu.METARESET'), {
            btn : '',
            fn : function(){
              vm.deleteColumns = vm.metaTable.metaColumns;
              vm.metaColumnYN = 'N';
              vm.currentActionView = 'add';

              var data = vm.metaTable;
              postApi.select('MetaColumn.getTableColumns', data, function(result){
                if (result.header.status === CONSTANT.HttpStatus.OK) {
                  vm.metaTable.metaColumns = result.body.docs;
                }
              }, function(error) {
                console.error('Error> h0102-list-ctrl> getList()', status, error);
              });
            }
          }, {
            btn : '',
            fn : function(){
            }
          });
        }else{
          var data = vm.metaTable;
          postApi.select('MetaColumn.getTableColumns', data, function(result){
            if (result.header.status === CONSTANT.HttpStatus.OK) {
              vm.metaTable.metaColumns = result.body.docs;
            }
          }, function(error) {
            console.error('Error> h0102-list-ctrl> getList()', status, error);
          });
        }
      }

      $scope.$on('broadcastSetChangeTenantID', function(event, args) {
        getMetaTableDetail();
      });

      function goModifyMetaTable() {
        $state.go('app.boardmng.modify', {
          tableNm : $stateParams.tableNm
        });
      }
    }, ]);
