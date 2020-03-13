webapp.controller('BoardMngEditCtrl', [ '$scope', '$state', '$stateParams', 'BoardMngAPISrv', 'postApi', 'modalFactory', 'GLOBAL_CONSTANT', 'gAlert', '$rootScope','$location','$window','gConfirm','$translate', 'SystemCodeAPISrv',
    function BoardMngEditCtrl($scope, $state, $stateParams, boardMngApi, postApi, modalFactory, CONSTANT, gAlert, $rootScope, $location, $window, gConfirm, $translate, systemCodeAPISrv) {

      var vm = this;
      vm.COLUMN_EDIT_STATE_DELETE = 'D';
      vm.COLUMN_EDIT_STATE_ADD = 'A';
      vm.COLUMN_EDIT_STATE_MODIFY = 'M';
      vm.COLUMN_EDIT_STATE_PENDING = '';
      vm.ChangeCustomColumn = ChangeCustomColumn;
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
      vm.makeSrch = makeSrch;

      vm.deleteColumns = [];
      vm.metaColumnYN = 'N';
      vm.dataloader = false;
      vm.changeColumn = 'N';
      vm.srchTenantId = $rootScope.gVariable.srchTenantId;

      (function getMetaTableEdit() {
        getModuleTypeList();
        if (angular.isDefined($stateParams.tableNm) && $stateParams.tableNm != '') {
          vm.currentActionView = 'modify';
          getMetaTableDetail();
        } else {
          vm.currentActionView = 'add';
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

      vm.srch = {};
      if (!$stateParams.srch) {
        vm.srch = {
          page : 1,
          viewSize : CONSTANT.PAGINATION.VIEWSIZE,
        };
      } else {
        vm.srch = JSON.parse(decodeURIComponent($stateParams.srch));
      }

      vm.layout = $rootScope.gVariable.layoutBoard;

      console.log(vm.layout);

      vm.onSelectCallback = function(data) {
        vm.metaTable.metaColumns.forEach(function(item, indx) {
          if (item.metaColumnId == data.CallbackTarget) {
            item.columnPhysicalNm = data.Code;
            return;
          }
        });
      };

      function makeSrch(){
        return encodeURIComponent(JSON.stringify(vm.srch, replacer));
      }
      function getMetaTableDetail() {
        vm.dataloader = true;
        var res = boardMngApi.getBoardMngApi().get({
          tableNm : $stateParams.tableNm,
          srchTenantId : $rootScope.gVariable.srchTenantId
        }).$promise;
        res.then(function(json) {
          vm.metaTable = json.responseVO.body.docs[0];
          if (vm.metaTable) {
            vm.metaTable.metaColumns.forEach(function(elm, idx) {
              elm.columnValid = true;
              elm.dirty = vm.COLUMN_EDIT_STATE_PENDING;
              if (elm.customColumnYN == 'Y') {
                elm.type = 'add';
                elm.commoncodeDATA = {
                  CallbackTarget : elm.metaColumnId,
                  CodeType : 'METACOLUMN',
                  Code : elm.columnPhysicalNm,
                  ReloadSeq : 1
                }
              } else if (elm.customColumnYN == 'N') {
                elm.type = 'old';
              }
            });

            if(vm.metaTable.metaColumns.length > 0)
              vm.metaColumnYN = 'Y';
          }

          vm.dataloader = false;
        });
      }

      function addColumn(type) {
        var newnum = Math.floor(Math.random() * 899999999999999 + 100000000000000);

        var newLine = {
          metaColumnId : newnum.toString(36),
          columnPhysicalNm : '',
          columnLogicalNm : '',
          columnSection : '',
          columnPhysicalDataType : '10',
          columnLogicalDataType : '10',
          columnPhysicalDataSize : '',
          listColumnWidth : '10%',
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
          codeType : '',
          customColumnYN : type == 'add' ? 'Y' : 'N',
          keyColumnYN : 'Y',
          dirty : vm.COLUMN_EDIT_STATE_ADD,
          columnValid : false,
          commoncodeDATA : {
            CallbackTarget : newnum.toString(36),
            CodeType : 'METACOLUMN',
            ReloadSeq : 1
          },
          type : type
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
        vm.dataloader = true;

        if(!validateCheck()){
          return false;
        }

        var data = vm.metaTable;
        data.currentActionView = vm.currentActionView;
        data.deleteColumns = vm.deleteColumns;

        postApi.sendPostApi('api/boardmng/metatables', vm.metaTable.tableNm, data, function(result){

          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              $rootScope.showSimpleToast($translate.instant('Menu.SAVED'));
              goModifyMetaTable();
            } else {
              $rootScope.showSimpleToast('failed to save');
            }
          }
          vm.dataloader = false;
        }, function(error) {
          vm.dataloader = false;
          $rootScope.showSimpleToast('failed to save');
          console.error('Error> h0102-list-ctrl> getList()', status, error);
        });

    /*         if(vm.currentActionView == 'modify') {
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
            vm.dataloader = false;
          }, function(error) {
            vm.dataloader = false;
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
            vm.dataloader = false;
          }, function(error) {
            vm.dataloader = false;
            console.error('Error> h0102-list-ctrl> getList()', status, error);
          });
        } */
      }

      function saveAction(promise) {
        promise.then(function(json) {
          goModifyMetaTable();
        });
      }

      function deleteColumn(selectedColumn) {
          vm.metaTable.metaColumns.splice(vm.metaTable.metaColumns.indexOf(selectedColumn), 1);
          vm.deleteColumns.push(selectedColumn);
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
        var res = false;
        vm.metaTable.metaColumns.forEach(function(item, indx) {
          if (item.columnLogicalNm == null || item.columnLogicalNm.trim() == '') {
            res = true;
          }
        });
        return res;
      }

      function validateCheck(){
        if(vm.currentActionView == 'add'){
          if(vm.usingTableNm.length != 0){
            gAlert('','Menu.EM710VA03');
            vm.dataloader = false;
            return false;
          }
        }

        return true;
      }

      function getTableColumns() {
        vm.dataloader = true;
        if(vm.metaColumnYN == 'Y') {
          gConfirm('', $translate.instant('Menu.METARESET'), {
            btn : '',
            fn : function(){

              vm.deleteColumns = vm.metaTable.metaColumns;
              vm.metaColumnYN = 'N';

              var data = vm.metaTable;
              postApi.select('MetaColumn.getTableColumns', data, function(result){
                if (result.header.status === CONSTANT.HttpStatus.OK) {
                  var newnum = 0;
                  result.body.docs.forEach(function(elm,indx){

                    newnum = Math.floor(Math.random() * 899999999999999 + 100000000000000);
                    elm.metaColumnId = newnum.toString(36);
                    if (elm.customColumnYN == "N") {
                      elm.columnSection = "";

                      if (elm.dataType == "varchar") {
                        elm.columnPhysicalDataType = "10";
                        elm.columnLogicalDataType = "10";
                      } else if (elm.dataType == "datetime" || elm.dataType == "date") {
                        elm.columnPhysicalDataType = "40";
                        elm.columnLogicalDataType = "40";
                      } else if (elm.dataType == "int") {
                        elm.columnPhysicalDataType = "20";
                        elm.columnLogicalDataType = "20";
                      } else if (elm.dataType == "bigint") {
                        elm.columnPhysicalDataType = "20";
                        elm.columnLogicalDataType = "20";
                      } else if (elm.dataType == "char") {
                        elm.columnPhysicalDataType = "10";
                        elm.columnLogicalDataType = "10";
                      } else {
                        elm.columnPhysicalDataType = "10";
                        elm.columnLogicalDataType = "10";
                      }
                      elm.columnPhysicalDataSize = "";
                      elm.listColumnWidth = "20%";
                      elm.listColumnTextAlign = "text-center";
                      elm.listColumnShowYN = "Y";
                      elm.listColumnShowLevel = "3";
                      elm.editColumnWidth = "col-lg-4 col-md-6";
                      elm.editColumnShowYN = "Y";
                      elm.editColumnHeight = "";
                      elm.columnDesc = "";
                      elm.columnCodeValue = "";
                      elm.codeType = "";
                      elm.dirty = "";
                    }

                    if (elm.customColumnYN == 'Y') {
                      elm.commoncodeDATA = {
                        CallbackTarget : elm.metaColumnId,
                        CodeType : 'METACOLUMN',
                        Code : elm.columnPhysicalNm,
                        ReloadSeq : 1
                      };
                    }
                  });
                  vm.metaTable.metaColumns = result.body.docs;
                }
                vm.dataloader = false;
              }, function(error) {
                vm.dataloader = false;
                console.error('Error> h0102-list-ctrl> getList()', status, error);
              });
            }
          }, {
            btn : '',
            fn : function(){
              vm.dataloader = false;
            }
          });
        }else{
          var data = vm.metaTable;
          postApi.select('MetaColumn.getTableColumns', data, function(result){
            if (result.header.status === CONSTANT.HttpStatus.OK) {
              var newnum = 0;
              result.body.docs.forEach(function(elm,indx){
                newnum = Math.floor(Math.random() * 899999999999999 + 100000000000000);
                elm.metaColumnId = newnum.toString(36);

                if(elm.customColumnYN == 'N'){
                  elm.columnSection = '';
                  if(elm.dataType =="varchar"){

                    elm.columnPhysicalDataType = '10';
                    elm.columnLogicalDataType = '10';

                  }else if(elm.dataType =="datetime"){

                    elm.columnPhysicalDataType = '40';
                    elm.columnLogicalDataType = '40';

                  }else if(elm.dataType =="int"){

                    elm.columnPhysicalDataType = '20';
                    elm.columnLogicalDataType = '20';

                  }else if(elm.dataType =="bigint"){

                    elm.columnPhysicalDataType = '20';
                    elm.columnLogicalDataType = '20';

                  }else if(elm.dataType =="char"){

                    elm.columnPhysicalDataType = '10';
                    elm.columnLogicalDataType = '10';

                  }else{
                    elm.columnPhysicalDataType = '10';
                    elm.columnLogicalDataType = '10';
                  }
                  elm.columnPhysicalDataSize = '';
                  elm.listColumnWidth = '10%';
                  elm.listColumnTextAlign = 'text-center';
                  elm.listColumnShowYN = 'Y';
                  elm.listColumnShowLevel = '3';
                  elm.editColumnWidth = 'col-lg-4 col-md-6';
                  elm.editColumnShowYN = 'Y';
                  elm.editColumnHeight = '';
                  elm.columnDesc = '';
                  elm.columnCodeValue = '';
                  elm.codeType = '';
                  elm.keyColumnYN = 'Y';
                }
                if (elm.customColumnYN == 'Y') {
                  elm.commoncodeDATA = {
                    CallbackTarget : elm.metaColumnId,
                    CodeType : 'METACOLUMN',
                    Code : elm.columnPhysicalNm,
                    ReloadSeq : 1
                  }
                }
              });
              vm.metaTable.metaColumns = result.body.docs;
            }
            vm.dataloader = false;
          }, function(error) {
            vm.dataloader = false;
            console.error('Error> h0102-list-ctrl> getList()', status, error);
          });
        }
      }

      $scope.$on('broadcastSetChangeTenantID', function(event, args) {
        vm.srchTenantId = $rootScope.gVariable.srchTenantId;
        vm.metaColumnYN = 'N';
        vm.changeColumn = 'N';
        getMetaTableDetail();
      });

      function goModifyMetaTable() {
        var srch = $stateParams.srch;

        if (vm.layout == 'N') {
          if (vm.metaTable.tableNm == null) {
            $state.go("app.boardmng.list", { srch: srch, tableNm: ''}, {reload:"app.boardmng.list"});
          } else {
            // 조회 화면 이동
            $state.go("app.boardmng.list.modify", {
              srch: srch,
              tableNm : vm.metaTable.tableNm
            });
          }
        } else {
          vm.srch.reload = (new Date()).getTime();
          srch = encodeURIComponent(JSON.stringify(vm.srch, replacer));
          $state.go("app.boardmng.list.modify", {srch: srch, tableNm: vm.metaTable.tableNm});
        }
      }

      function ChangeCustomColumn() {
        vm.dataloader = true;
        if(vm.metaColumnYN == 'Y' || vm.changeColumn == 'Y') {
          gConfirm('', $translate.instant('Menu.METARESET'), {
            btn : '',
            fn : function(){
              if (vm.changeColumn =='N') vm.deleteColumns = vm.metaTable.metaColumns;
              vm.metaColumnYN = 'N';
              vm.changeColumn = 'N';
              vm.metaTable.metaColumns = [];
              vm.dataloader = false;
            }
          }, {
            btn : '',
            fn : function(){
              vm.dataloader = false;
            }
          });
        }else{
          var data = vm.metaTable;
          vm.changeColumn = 'Y';
          postApi.select('BoardMng.getChangeTableColumns', data, function(result){
            if (result.header.status === CONSTANT.HttpStatus.OK) {
              var newnum = 0;
              vm.metaTable.metaColumns = result.body.docs;
              vm.metaTable.metaColumns.forEach(function(elm, idx) {

                newnum = Math.floor(Math.random() * 899999999999999 + 100000000000000);
                elm.metaColumnId = newnum.toString(36);
                elm.tenantId = null;

                if (elm.customColumnYN == 'Y') {
                  elm.commoncodeDATA = {
                    CallbackTarget : elm.metaColumnId,
                    CodeType : 'METACOLUMN',
                    Code : elm.columnPhysicalNm,
                    ReloadSeq : 1
                  }
                }
              });
            }
            vm.dataloader = false;
          }, function(error) {
            vm.dataloader = false;
            console.error('Error> h0102-list-ctrl> getList()', status, error);
          });
        }
      }

      function getModuleTypeList () {
        var res = boardMngApi.doModuleTypeList().post({
          CodeType : 'MODULETYPE',
          srchTenantId : $rootScope.gVariable.srchTenantId
        }).$promise;
        res.then(function(json) {
          vm.moduleTypeList = json.responseVO.body.docs;
        });
      }

    }, ]);
