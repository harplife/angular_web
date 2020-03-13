webapp.controller('CommonCodeTreeCtrl', [ '$scope', '$element', '$compile', 'GLOBAL_CONSTANT', 'CommonAPISrv', 'postApi',
  function CommonCodeTreeCtrl($scope, $element, $compile, CONSTANT, commonApi, postApi) {
    var vm = this;
    vm.isDisabled = false;

    vm.codeModel = {};
    vm.codeChanged = null;
    vm.data = {};
    vm.chooseMessage = 'Menu.CHOOSE';
    vm.allList = {};
    vm.list = [[], [], [], []];
    vm.CommonCode = [];
    vm.Code = [];

    vm.onChangeHandler = function(index) {
      angular.forEach(vm.Code, function(item, key) {
        if (key > index) {
          vm.Code[key] = '';
        }
      });

      vm.list[index + 1] = [];

      if (vm.CommonCode[index]) {
        vm.Code[index] = vm.CommonCode[index].Code;
        angular.forEach(vm.allList, function(item) {
          if (vm.CommonCode[index] && vm.CommonCode[index].CommonCodeId == item.ParentCommonCodeId) {
            vm.list[index + 1].push(item);
          }
        });
      } else {
        vm.Code[index] = '';
      }

      try {
        var bLast = vm.list[index + 1].length == 0 && vm.Code[index] ? true : false;
        vm.initChangeData(vm.Code.filter(function(el){return el != '';}).join('.'), bLast);
      } catch (err) {
        vm.initChangeData("", true);
      }
    };

    vm.setSelectList = setSelectList;
    function setSelectList(codeList) {
      if (codeList == null || codeList == '') {
        vm.list = {};
        return;
      }

      vm.list = [[], [], [], []];

      if (vm.codeModel) {
        vm.Code = vm.codeModel.split('.');

        angular.forEach(vm.Code, function(code, key) {
          vm.CommonCode[key] = {Code:code};
        });
      }

      vm.allList = codeList;

      vm.CodeLevel = vm.allList.reduce(function(a, b) {
        if (a.indexOf(b.CodeLevel) < 0) a.push(b.CodeLevel);
        return a;
      }, []);

      var index = 0;

      angular.forEach(vm.allList, function(item) {
        if (vm.CodeLevel[0]) {
          if (vm.CodeLevel[0] == item.CodeLevel) {
            vm.list[0].push(item);

            if (vm.CommonCode[0] && vm.CommonCode[0].Code == item.Code) {
              vm.CommonCode[0].CommonCodeId = item.CommonCodeId;
            }
          }
        }
      });

      angular.forEach(vm.CodeLevel, function(codeLevel, key) {
        if (key == 0) return;

        angular.forEach(vm.allList, function(item) {
          if (codeLevel == item.CodeLevel) {
            if (vm.CommonCode[key - 1] && vm.CommonCode[key - 1].CommonCodeId == item.ParentCommonCodeId) {
              vm.list[key].push(item);

              if (vm.CommonCode[key] && vm.CommonCode[key].Code == item.Code) {
                vm.CommonCode[key].CommonCodeId = item.CommonCodeId;
              }
            }
          }
        });
      });
    }

    vm.getSelectList = getSelectList;
    function getSelectList(codeType) {
      if (codeType == null || codeType == '') {
        vm.list = {};
        return;
      }

      vm.list = [[], [], [], []];

      if (vm.codeModel) {
        vm.Code = vm.codeModel.split('.');

        angular.forEach(vm.Code, function(code, key) {
          vm.CommonCode[key] = {Code:code};
        });
      }

      vm.data.CodeType = codeType;
      vm.data.mapCode = "CommonCode.getCommonCodeTreeValue";

      var prms = postApi.select(vm.data, function(result) {
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          vm.allList = result.body.docs;

          vm.CodeLevel = vm.allList.reduce(function(a, b) {
            if (a.indexOf(b.CodeLevel) < 0) a.push(b.CodeLevel);
            return a;
          }, []);

          var index = 0;

          angular.forEach(vm.allList, function(item) {
            if (vm.CodeLevel[0]) {
              if (vm.CodeLevel[0] == item.CodeLevel) {
                vm.list[0].push(item);

                if (vm.CommonCode[0] && vm.CommonCode[0].Code == item.Code) {
                  vm.CommonCode[0].CommonCodeId = item.CommonCodeId;
                }
              }
            }
          });

          angular.forEach(vm.CodeLevel, function(codeLevel, key) {
            if (key == 0) return;

            angular.forEach(vm.allList, function(item) {
              if (codeLevel == item.CodeLevel) {
                if (vm.CommonCode[key - 1] && vm.CommonCode[key - 1].CommonCodeId == item.ParentCommonCodeId) {
                  vm.list[key].push(item);

                  if (vm.CommonCode[key] && vm.CommonCode[key].Code == item.Code) {
                    vm.CommonCode[key].CommonCodeId = item.CommonCodeId;
                  }
                }
              }
            });
          });
        }
      }, function(error) {
        console.error('Error> getSelectList', error);
      });
    }

  }
]);
