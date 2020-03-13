webapp.controller('WjmQstGotoModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', 'gAlert', 'gConfirm', '$filter', 'wjmSurvey',
  function WjmQstGotoModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi, gAlert, gConfirm, $filter, wjmSurvey) {
    var vm = this;

    // html 에서 사용하는 함수 연결
    vm.close = close;
    vm.apply = apply;

    (function WjmQstGotoModalCtrl() {
      vm.data = {};

      // 설문관련 변수
      vm.svyPages = [];
      vm.svyQsts = [];
      vm.svyQstItems = [];
      vm.qt = [];
      vm.it = [];
      vm.gotoList = [];

      $scope.wjmSurvey = wjmSurvey;

      // 부모페이지의 전달값 삽입
      vm.svyPages = angular.copy(toModalData.svyPages);
      vm.svyQsts = angular.copy(toModalData.svyQsts);
      vm.svyQstItems = angular.copy(toModalData.svyQstItems);
      vm.qt = $filter('filter')(vm.svyQsts, {qtId: toModalData.qtId}, true)[0];
      vm.it = $filter('filter')(vm.svyQstItems, {qtId: toModalData.qtId}, true);

      //vm.pageType = isNullOrEmpty(toModalData.pageType) ? "" : toModalData.pageType;

      /*
      vm.srch = {
        keyId: toModalData.keyId
      };
      */

      getGotoList();
    })();

    /**
     * 문항,보기 변경 이벤트
     *
     * @param {string}
     * @return {boolean}
     */
    vm.chgQstGotoList = function () {
      var i = 0;
      if (!isNullOrEmpty(vm.qt.GoToQstId)) {
        for (i = 0; i < vm.svyQstItems.length; i++) {
          vm.svyQstItems[i].GoToQstId = "";
        }
      }
    };
    vm.chgQstItemGotoList = function (i) {
      if (!isNullOrEmpty(vm.it[i].GoToQstId)) {
        vm.qt.GoToQstId = "";
      }
    };

    /**
     * 분기목록
     * @param
     * @return
     */
    function getGotoList() {
      var i = 0;
      var j = 0;
      var qt = [];

      for (i = 0; i < vm.svyPages.length; i++) {
        qt = $filter('filter')(vm.svyQsts, {PageNo: vm.svyPages[i].PageNo}, true);

        for (j = 0; j < qt.length; j++) {
          if (qt[j].qtId != toModalData.qtId) {
            if (qt[j].stat != "D") {
              vm.gotoList.push({
                qtId: qt[j].qtId,
                gotoTxt: "[" + qt[j].PageNo + "페이지] " + wjmSurvey.getQstTypeNm(qt[j].QstType) + " " + (qt[j].QstNo == "0" ? "" : qt[j].QstNo + ".") + qt[j].QstSubject
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
      var i = 0;
      var qt = [];
      var it = [];

      // 입력 데이터 추가
      switch (vm.qt.QstType) {
        // 선택형, 이미지형, 분류정보
        case "1":
        case "4":
        case "C":
          qt = $filter('filter')(toModalData.svyQsts, {qtId: toModalData.qtId}, true)[0];
          if (qt.GoToQstId != vm.qt.GoToQstId) {
            qt.stat = "U";
            qt.GoToQstId = vm.qt.GoToQstId;
          }

          for (i = 0; i < vm.it.length; i++) {
            it = $filter('filter')(toModalData.svyQstItems, {itId: vm.it[i].itId}, true)[0];
            if (it.GoToQstId != vm.it[i].GoToQstId) {
              it.stat = "U";
              it.GoToQstId = vm.it[i].GoToQstId;
            }
          }
          break;

        default : break;
      }

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
