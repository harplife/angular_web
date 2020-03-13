webapp.controller('TreeModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi', 'gAlert', 'gConfirm', '$translate', '$timeout',
    function TreeModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi, gAlert, gConfirm, $translate, $timeout ) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.columnMap = {};
      var tree;
      $scope.my_tree = tree = {};
      vm.srch = {};
      (function TreeModalCtrl() {
        vm.getRequestParams = getRequestParams;
        getTreeList();
      })();

      function getRequestParams() {
        var req = {
          page : vm.currentPageNum,
          viewSize : vm.viewSizePerPage,
          formType: toModalData.formType,
        }
        vm.filter = req;
        return req;
      }

      function getTreeList() {
        // 사전에 트리 선언함.(중요포인트)
        vm.dataloader = true;
        $scope.my_data = [];

        // 로케이션관리 select 검색실행함
        var data = vm.srch;

        data.mapCode = 'Campaign.getGroupList';
        postApi.select(data, function(result) {
          vm.dataloader = false;

          if (result.header.status == CONSTANT.HttpStatus.OK) {

            if (result.body.docs.length == 0) {
              return;
            }

            // select한 datatable 바인딩
            vm.lists = result.body.docs;

            vm.topItem = result.body.docs[0];

            refreshTree();

            // 트리 펼치기
            $timeout(function() {
              return tree.expand_init();
            }, 1);

          }
        }, function(error) {
          vm.dataloader = false;
          console.error('fail', status, data);
        });
      }

      function refreshTree() {

        // 리스트 생성
        var arrlist = [];

        // for문으로 다시 json 구조로 변환함.
        angular.forEach(vm.lists, function(item) {
          // 객체 생성
          var data = {};

          data.label = $translate.instant(item.GrpNm);
          data.guid = item.GrpId;
          data.parent = item.ParentGrpId == undefined || item.ParentGrpId == 0 ? null : item.ParentGrpId;
          data.classes = [];
          //data.classes.push(item.TenantId == '0' ? '' : 'color-red');

          // 리스트에 생성된 객체 삽입
          arrlist.push(data);

          if (item.GrpId > vm.maxGrpId)
            vm.maxGrpId = item.GrpId;
        });

        // 계층형 json 구조로 변환함
        var recursiveArray = unflatten(arrlist);

        // guid, parent 제외 변환함
        traverse(recursiveArray);

        // 트리구조에 바인딩
        $scope.my_data = recursiveArray;

        // 트리 펼치기
  //        $timeout(function() {
  //          return tree.expand_all();
  //        }, 1);

      }

      // 계층형 json 구조로 변환
      function unflatten(items) {
        // 다시 설정(배치)하는 부분
        return items.reduce(insert, {
          res : [],
          map : {}
        }).res;
      }

    // 계층형 json 부모/자식 구분하여 구조 변환
    function insert(obj, item) {
      var parent = item.parent; // 부모값
      var map = obj.map;
      map[item.guid] = item; // 아이템 구성함

      if (parent === null)
        obj.res.push(item); // 부모값 생성
      else {
        var parentItem = map[parent];
        // 자식값 생성
        if (parentItem != null) {
          if (parentItem.hasOwnProperty("children"))
            parentItem.children.push(item);
          else
            parentItem.children = [ item ];
        }
      }

      return obj;
    }

    // guid, parent 제외한 계층형 json 구조 변환하기
    function traverse(jsonObj) {

      for (var i = 0; i < jsonObj.length; i++) {
        if (jsonObj[i].children == null) {
        } else {
          traverse(jsonObj[i].children);
        }

        // label, children 만 추가함
        var newItem = {
          "label" : jsonObj[i].label,
          "data" : jsonObj[i].guid,
          "children" : jsonObj[i].children,
          "classes" : jsonObj[i].classes,
        }
        jsonObj[i] = newItem;
      }
    }



      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      function ok() {
        var branch = tree.get_selected_branch();

        var data = {GrpNm : branch.label, GrpId : branch.data};
        $uibModalInstance.close(data);
      }

    } ]);
