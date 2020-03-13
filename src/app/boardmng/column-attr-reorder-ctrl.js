webapp.controller('ColumnAttrReorderCtrl', [ '$scope', '$uibModalInstance', '$filter', 'sortArrayFactory', 'toModalData',
    function ObjectTypeReorderController($scope, $uibModalInstance, $filter, sorts, toModalData) {
      var vm = this;
      var COLUMN_EDIT_STATE_MODIFY = 'M';
      var COLUMN_EDIT_STATE_PENDING = '';
      vm.selectedIdx = 0;
      vm.objModel = [];

      vm.onSelect = onSelect;
      vm.moveUp = moveUp;
      vm.moveDown = moveDown;
      vm.moveTop = moveTop;
      vm.moveBottom = moveBottom;
      vm.move = move;
      vm.onSave = onSave;
      vm.onClose = onClose;
      vm.title = '사용자 속성 정렬';
      vm.COLUMN_EDIT_STATE_MODIFY = 'M';
      angular.copy(sorts.sortArrayObject(toModalData, toModalData.ListColumnSort), vm.objModel);
      vm.objModelLen = vm.objModel.length;

      function onSelect(idx) {
        vm.selectedIdx = idx;
      }

      function moveUp() {
        var destIdx = vm.selectedIdx - 1;
        if (destIdx == -1) {
          return;
        }

        vm.move(vm.selectedIdx, destIdx);
        vm.selectedIdx = destIdx;
      }

      function moveDown() {
        var destIdx = vm.selectedIdx + 1;
        if (destIdx == vm.objModelLen) {
          return;
        }

        vm.move(vm.selectedIdx, destIdx);
        vm.selectedIdx = destIdx;
      }

      function moveTop() { // 맨위
        var temp = vm.objModel[vm.selectedIdx];
        vm.objModel.splice(vm.selectedIdx, 1);
        vm.objModel.unshift(temp);
        vm.selectedIdx = 0;
      }

      function moveBottom() { // 맨아래
        var temp = vm.objModel[vm.selectedIdx];
        vm.objModel.splice(vm.selectedIdx, 1);
        vm.objModel.push(temp);
        vm.selectedIdx = vm.objModelLen - 1;
      }

      function move(orgIdx, destIdx) {
        var temp = vm.objModel[destIdx];
        vm.objModel[destIdx] = vm.objModel[orgIdx];
        vm.objModel[orgIdx] = temp;
      }

      // 순서 변경 저장
      function onSave() {
        var reorderList = [];
        angular.forEach(vm.objModel, function(node, idx) {
          node.listColumnSort = idx;
          if (node.dirty == COLUMN_EDIT_STATE_PENDING) {
            node.dirty = COLUMN_EDIT_STATE_MODIFY;
          }
        });
        $uibModalInstance.close(vm.objModel);
      }

      // 취소|닫기 버튼
      function onClose() {
        $uibModalInstance.dismiss('cancel');
      }
    } ]);
