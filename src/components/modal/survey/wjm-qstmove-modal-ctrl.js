webapp.controller('WjmQstMoveModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', 'gAlert', 'gConfirm', '$filter', 'wjmSurvey',
  function WjmQstMoveModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi, gAlert, gConfirm, $filter, wjmSurvey) {
    var vm = this;

    // html 에서 사용하는 함수 연결
    vm.close = close;
    vm.apply = apply;

    (function WjmQstMoveModalCtrl() {
      vm.data = {};

      // 설문관련 변수
      vm.svyPages = [];
      vm.svyQsts = [];
      vm.qt = [];
      vm.moveList = [];

      // 부모페이지의 전달값 삽입
      vm.svyPages = angular.copy(toModalData.svyPages);
      vm.svyQsts = angular.copy(toModalData.svyQsts);
      //vm.qt = $filter('filter')(vm.svyQsts, {qtId: toModalData.qtId}, true)[0];
      vm.qt = $filter('filter')(toModalData.svyQsts, {qtId: toModalData.qtId}, true)[0];

      // 기본값
      vm.data.moveOrder = "BEFORE";

      /*
      vm.srch = {
        keyId: toModalData.keyId
      };
      */

      getMoveList();
    })();

    /**
     * 문항목록
     * @param
     * @return
     */
    function getMoveList() {
      var i = 0;
      var j = 0;
      var qt = [];

      for (i = 0; i < vm.svyPages.length; i++) {
        qt = $filter('filter')(vm.svyQsts, {PageNo: vm.svyPages[i].PageNo}, true);

        for (j = 0; j < qt.length; j++) {
          if (qt[j].qtId != toModalData.qtId) {
            if (qt[j].stat != "D" && qt[j].QstLock == 'N') {
              vm.moveList.push({
                qtId: qt[j].qtId,
                moveTxt: "[" + qt[j].PageNo + "페이지] " + wjmSurvey.getQstTypeNm(qt[j].QstType) + " " + (qt[j].QstNo == "0" ? "" : qt[j].QstNo + ".") + qt[j].QstSubject
              });
            }
          }
        }
      }
    }

    /**
     * 적용 버튼 이벤트
     *
     * @param
     * @return
     */
    function apply() {
      var tgtQt = [];
      var qstNo = 0;
      var sort = 0;

      if (isNullOrEmpty(vm.data.moveQtId)) {
        gAlert('', "이동기준 문항을 선택해주세요.");
        return false;
      }

      tgtQt = $filter('filter')(toModalData.svyQsts, {qtId: vm.data.moveQtId}, true)[0];

      vm.qt.PageNo = tgtQt.PageNo;

      if (vm.data.moveOrder == "BEFORE") {
        vm.qt.QstSort = parseInt(tgtQt.QstSort) - 0.1;
      }
      else {
        vm.qt.QstSort = parseInt(tgtQt.QstSort) + 0.1;
      }

      toModalData.svyQsts.sort( function( a, b ) { return (a.QstSort > b.QstSort) ? 1 : ((b.QstSort > a.QstSort) ? -1 : 0)} );
      toModalData.svyQsts.forEach(function(i, idx) {
        sort = idx + 1;

        if (i.QstSort != sort) {
          i.stat = "U";
          i.QstSort = sort;
        }

        if (i.QstType != "R") {
          qstNo++;

          if (i.QstNo != qstNo) {
            i.stat = "U";
            i.QstNo = qstNo;
          }
        }
      });

      $uibModalInstance.close();
    }

    /**
     * 닫기 버튼 이벤트
     *
     * @param
     * @return
     */
    function close() {
      $uibModalInstance.dismiss('cancel data');
    }
  } ]);
