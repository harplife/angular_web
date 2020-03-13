webapp.controller('WjmPreModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', 'gAlert', 'gConfirm', '$filter', 'wjmSurvey',
  function WjmPreModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi, gAlert, gConfirm, $filter, wjmSurvey) {
    var vm = this;

    // html 에서 사용하는 함수 연결
    vm.close = close;
    //vm.apply = apply;

    (function WjmPreModalCtrl() {
      vm.data = {};

      // 설문관련 변수
      vm.svyInfo = [];
      vm.svyPages = [];
      vm.svyQsts = [];
      vm.svyQstItems = [];
      vm.svyPagesType = 1;
      vm.svyPagesTypeTxt = "소개글";
      vm.svyPagesCur = 1;
      vm.svyPagesTxt = "설문시작";

      // 부모페이지의 전달값 삽입
      vm.svyInfo = angular.copy(toModalData.svyInfo);
      vm.svyPages = angular.copy(toModalData.svyPages);
      vm.svyQsts = angular.copy(toModalData.svyQsts);
      vm.svyQstItems = angular.copy(toModalData.svyQstItems);

      // 기타
      vm.svyResps = []; // 응답데이터
      vm.svyQstsCur = $filter('filter')(vm.svyQsts, {PageNo: vm.svyPagesCur}, true); // 현재 페이지의 문제 데이터 (분기처리를 위함)
      vm.beginQtId = "";

      $scope.wjmSurvey = wjmSurvey;

      setIsUseGotoPage();

      /*
      vm.srch = {
        keyId: toModalData.keyId
      };
      */
    })();

    /**
     * 현재 페이지 문항 설정
     *
     * @param {string}
     * @return {boolean}
     */
    vm.setQstsCur = function () {
      var k = 0;
      var qstsCur = [];
      var qt = [];

      if (!isNullOrEmpty(vm.beginQtId)) {
        qt = $filter('filter')(vm.svyQsts, {qtId: vm.beginQtId}, true)[0];
        if (!isNullOrEmpty(qt)) {
          vm.svyPagesCur = qt.PageNo;
          vm.svyPagesType = 2;
        }

        qstsCur = angular.copy($filter('filter')(vm.svyQsts, {PageNo: vm.svyPagesCur}, true));
        /*
        qstsCur.forEach(function (i) {
          if (parseInt(i.QstSort) < parseInt(qt.QstSort)) {
            qstsCur.splice(qstsCur.indexOf(i), 1);
          }
        });
        */
        for (k = qstsCur.length - 1; k >= 0; k--) {
          if (parseInt(qstsCur[k].QstSort) < parseInt(qt.QstSort)) {
            qstsCur.splice(k, 1);
          }
        }
      }
      else {
        qstsCur = angular.copy($filter('filter')(vm.svyQsts, {PageNo: vm.svyPagesCur}, true));
      }

      vm.svyQstsCur = qstsCur;
      vm.beginQtId = "";
    };

    /**
     * 다음페이지 시작 문항 설정
     * 설명: 페이지에 문항중 다음 버튼을 눌렀을때 가야되는 분기는 최종적으로 하나이며,
     * 해당페이지에 복수의 분기가 설정된 경우 마지막으로 클릭한 문항, 마지막으로 클릭한 문항의 보기순으로 우선권을 가짐
     * @param {string}
     * @return {boolean}
     */
    vm.setBeginQtId = function (qt, it) {
      var itTmp = [];
      var isUseGoTo = false;

      if (!isNullOrEmpty(qt.GoToQstId)) {
        vm.beginQtId = qt.GoToQstId;
        return false;
      }

      if (!isNullOrEmpty(it.GoToQstId)) {
        vm.beginQtId = it.GoToQstId;
      }
      else {
        itTmp = $filter('filter')(vm.svyQstItems, {qtId: qt.qtId}, true);
        itTmp.forEach(function(i) {
          if (!isNullOrEmpty(i.GoToQstId)) {
            vm.beginQtId = "";
            return false;
          }
        });
      }
    };

    /**
     * 입력항목 체크
     * @param
     * @return
     */
    function getIsValidData() {
      var j = 0;
      var isPass = true;

      if (vm.svyInfo.QstPassYN == "Y") return true;

      vm.svyQstsCur.forEach(function(i) {
        if (i.QstType == "R") return true;

        if (isNullOrEmpty(vm.svyResps[i.qtId]) || vm.svyResps[i.qtId].length == 0) {
          isPass = false;
          return false;
        }

        if (i.QstType == "3") {
          if (i.QstTopCnt != Object.keys(vm.svyResps[i.qtId]).length) {
            isPass = false;
            return false;
          }

          for (j = 0; j < i.QstTopCnt; j++) {
            if (isNullOrEmpty(vm.svyResps[i.qtId][j])) {
              isPass = false;
              return false;
            }
          }
        }
        else if (i.QstType == "C" && i.ClassfyCd == "MB") {
          if (Object.keys(vm.svyResps[i.qtId]).length != 3
            || isNullOrEmpty(vm.svyResps[i.qtId][0])
            || isNullOrEmpty(vm.svyResps[i.qtId][1])
            || isNullOrEmpty(vm.svyResps[i.qtId][2])
          ) {
            isPass = false;
            return false;
          }
        }
        else if (i.QstType == "C" && i.ClassfyCd == "EM") {
          if (Object.keys(vm.svyResps[i.qtId]).length != 2
            || isNullOrEmpty(vm.svyResps[i.qtId][0])
            || isNullOrEmpty(vm.svyResps[i.qtId][1])
          ) {
            isPass = false;
            return false;
          }
        }
      });

      if (!isPass) {
        gAlert('', '응답하지 않은 문항이 존재합니다.');
      }

      return isPass;
    }

    /**
     * 페이지타입 변경
     *
     * @param {string}
     * @return {boolean}
     */
    vm.setSvyPagesType = function (type) {
      var prevSvyPagesType = vm.svyPagesType;

      switch (type) {
        case "PREV":
          if (vm.svyPagesType == 2) {
            if (vm.svyPagesCur == 1 || vm.svyPages.length == 0) vm.svyPagesType--;
            else vm.svyPagesCur--;
          }
          else if (vm.svyPagesType == 3) {
            vm.svyPagesType--;
            vm.svyPagesCur = vm.svyPages.length;
          }

          break;
        case "NEXT":
          if (vm.svyPagesType == 1) {
            vm.svyPagesType++;
          }
          else if (vm.svyPagesType == 2) {
            if (!getIsValidData()) return false;
            vm.svyPagesCur++;
          }
          break;
        case "END":
          if (vm.svyPagesType == 2) {
            if (!getIsValidData()) return false;
            if (Object.keys(vm.svyResps).length == 0) {
              gAlert('', '응답한 문항이 없습니다. 최소 한개이상의 문항에 응답해주세요.');
              return false;
            }
          }

          vm.svyPagesType++;
          break;
        default : break;
      }

      vm.setSvyPagesTypeNext(prevSvyPagesType);
    };

    /**
     * 페이지타입 변경 후처리
     *
     * @param {string}
     * @return {boolean}
     */
    vm.setSvyPagesTypeNext = function(prevSvyPagesType) {

      // 현재페이지 내용 삽입
      if (prevSvyPagesType == 2) {
        vm.setQstsCur();
      }

      // 상단 설문타입 텍스트 설정
      switch (vm.svyPagesType) {
        case 1: vm.svyPagesTypeTxt = "소개글"; break;
        case 2: vm.svyPagesTypeTxt = "문항"; break;
        case 3: vm.svyPagesTypeTxt = "끝맺음말"; break;
        default: break;
      }

      // 상단 페이지 텍스트 설정
      if (vm.svyPagesType == 1) {
        vm.svyPagesTxt = "설문시작";
      }
      else if (vm.svyPagesType == 2) {
        vm.svyPagesTxt = vm.svyPagesCur + " / " + vm.svyPages.length + " 페이지 진행중";
      }
      else if (vm.svyPagesType == 3) {
        vm.svyPagesTxt = "설문완료";
      }

      //console.log("vm.svyQsts", vm.svyQsts);
      //console.log("vm.svyQstItems", vm.svyQstItems);
      //console.log("vm.svyResps", vm.svyResps);
    };

    /**
     * 설문버튼 상태변경
     *
     * @param {string}
     * @return {boolean}
     */
    vm.showSvyBtn = function (type) {
      var rtn = false;

      switch (type) {
        case "PREV":
          if (!vm.isUseGotoPage && vm.svyPagesType == 2) rtn = true;
          break;
        case "NEXT":
          if (
            vm.svyPagesType == 1
            || (vm.svyPagesType == 2 && vm.svyPagesCur != vm.svyPages.length && vm.svyPages.length != 0)
          ) rtn = true;
          break;
        case "END":
          if (vm.svyPagesType == 2 && (vm.svyPagesCur == vm.svyPages.length || vm.svyPages.length == 0)) rtn = true;
          break;
        default : break;
      }

      return rtn;
    };

    /**
     * 해당 설문에서 분기 사용여부 체크
     *
     * @param {string}
     * @return {boolean}
     */
    function setIsUseGotoPage() {
      var rtn = false;
      // 필터로 체크되지 않아서 반복문으로 체크
      /*
      if ($filter('filter')(vm.svyQsts, {GoToQstId: '!'}, true).length > 0
        || $filter('filter')(vm.svyQstItems, {GoToQstId: '!'}, true).length > 0
      ) vm.isUseGotoPage = true;
      */

      vm.svyQsts.forEach(function (i) {
        if (!isNullOrEmpty(i.GoToQstId)) {
          rtn = true;
          return false;
        }
      });

      if (!rtn) {
        vm.svyQstItems.forEach(function (i) {
          if (!isNullOrEmpty(i.GoToQstId)) {
            rtn = true;
            return false;
          }
        });
      }

      vm.isUseGotoPage = rtn;
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
