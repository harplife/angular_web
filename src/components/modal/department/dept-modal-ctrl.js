webapp.controller('DeptModalCtrl', ['$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', '$timeout', 'postApi',
	function DeptModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, $timeout, postApi) {
		var vm = this;
    vm.dataloader = false;

		vm.getList = getList;
		vm.selectItem = {}

    //my_tree 반드시 선언하기
    var tree;
    $scope.my_tree = tree = {};

		function getList() {
      vm.dataloader = true;
      // 사전에 트리 선언함.(중요포인트)
			$scope.my_data = [];

      var srch = {}

      //로케이션관리 select 검색실행함
      var data = srch;
      data.mapCode = 'Department.getDepartmentTree';
      postApi.select(data, function(result){
        if (result.header.status == CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length == 0){
            vm.dataloader = false;
            return;
          }

          // select한 datatable 바인딩
          vm.lists = result.body.docs;

          refreshTree();
          vm.dataloader = false;
        }
      },function(error) {
        console.error('fail', status, data);
        vm.dataloader = false;
			});
    }

    function refreshTree(){

      //리스트 생성
      var arrlist = new Array();

      // for문으로 다시 json 구조로 변환함.
      for (var i = 0; i < vm.lists.length; i++) {
        //객체 생성
        var data = new Object();

        data.label = vm.lists[i]['DeptNm'] ;
        data.guid = vm.lists[i]['DeptId'].toString() ;
        data.parent = vm.lists[i]['ParentDeptId'] == 0 ? null : vm.lists[i]['ParentDeptId'].toString()  ;

        // 리스트에 생성된 객체 삽입
        arrlist.push(data) ;
      }

      //계층형 json 구조로 변환함
      var recursiveArray = unflatten(arrlist);

      //guid, parent 제외 변환함
      traverse(recursiveArray);

      //트리구조에 바인딩
      $scope.my_data = recursiveArray;

      // 트리 펼치기
      $timeout(function() {
        return tree.expand_init();
      }, 1);
    }

		// 계층형 json 구조로 변환
		function unflatten(items) {

		    // 다시 설정(배치)하는 부분
			return items.reduce(insert, {
		        res: [],
		        map: {}
		    }).res;
		}

		// 계층형 json 부모/자식 구분하여 구조 변환
		function insert(obj, item) {

		  var parent     = item.parent;	//부모값
		  var map        = obj.map;
		  map[item.guid] = item;			//아이템 구성함

		  if (parent === null) obj.res.push(item);	//부모값 생성
		  else {
		    var parentItem = map[parent];
		    //자식값 생성
		    if (parentItem != null) {
  		    if (parentItem.hasOwnProperty("children"))
  		      parentItem.children.push(item);
  		    else parentItem.children = [item];
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
					    "label": jsonObj[i].label,
					    "data": jsonObj[i].guid,
					    "children": jsonObj[i].children,
					}
		    	jsonObj[i] = newItem;
			}
		}


		// 트리 목록에서 조회값
		$scope.dept_tree_handler = function(dept) {
      console.log(dept);
	    	vm.selectItem = dept;
		};


	  vm.cancel = cancel;
	  function cancel() {
			$uibModalInstance.dismiss('cancel data');
		}

    vm.ok = ok;
    function ok(){
      $uibModalInstance.close(vm.selectItem);
    }

		getList();

	}
]);
