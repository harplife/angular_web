webapp.controller('WjmQstModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', 'gAlert', 'gConfirm', '$filter', 'StaticVariable', '$rootScope', 'wjmSurvey',
  function WjmQstModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi, gAlert, gConfirm, $filter, StaticVariable, $rootScope, wjmSurvey) {
    var vm = this;

    // html 에서 사용하는 함수 연결
    vm.close = close;
    vm.apply = apply;

    (function WjmQstModalCtrl() {
      vm.data = {};

      // 설문관련 변수
      vm.svyQsts = [];
      vm.svyQstItems = [];
      vm.qt = [];
      vm.it = [];
      vm.classfyList = [];
      vm.classfyListLev1 = [];
      vm.classfyListLev2 = [];
      vm.imageList = [];
      vm.oClassfyCd = "";

      $scope.wjmSurvey = wjmSurvey;

      // 부모페이지의 전달값 삽입
      vm.svyQsts = angular.copy(toModalData.svyQsts);
      vm.svyQstItems = angular.copy(toModalData.svyQstItems);
      vm.qt = $filter('filter')(vm.svyQsts, {qtId: toModalData.qtId}, true)[0];
      vm.it = $filter('filter')(vm.svyQstItems, {qtId: toModalData.qtId}, true);

      //vm.manager = toModalData.manager;
      vm.SvyTypeId = toModalData.SvyTypeId;
      vm.ClassfyInfoId = toModalData.ClassfyInfoId;
      vm.pageType = isNullOrEmpty(toModalData.pageType) ? "" : toModalData.pageType;

      /*
      vm.srch = {
        keyId: toModalData.keyId
      };
      */

      if (!isNullOrEmpty(vm.SvyTypeId)) {
        getQstSecList();
      }

      switch (vm.qt.QstType) {
        case "4":
          // 이미지형
          getImageList();
          break;

        case "C":
          // 분류정보
          vm.oClassfyCd = vm.qt.ClassfyCd;
          setClassfyCommon();

          if (!isNullOrEmpty(vm.ClassfyInfoId)) {
            getClassfyList();
          }
          else {
            vm.classfyListLev1 = $filter('filter')(vm.classfyList, {ClassfyLevel: "1"}, true);
            vm.classfyListLev2 = $filter('filter')(vm.classfyList, {ClassfyLevel: "2"}, true);
          }
          break;

        default: break;
      }
    })();

    /**
     * 보기 추가
     *
     * @param {string}
     * @return {boolean}
     */
    vm.setSvyQstItemAdd = function () {
      var nextItId = wjmSurvey.getSvyCode("IT", vm.svyQsts, vm.svyQstItems);

      if (vm.it.length > wjmSurvey.maxSvyQstItemsCnt || vm.svyQstItems.length > wjmSurvey.maxSvyQstItemsCntAll) {
        gAlert('', "더이상 보기를 만들 수 없습니다.");
        return false;
      }

      switch (vm.qt.QstType) {
        // 선택형
        case "1":
          vm.it.push({
            itId: nextItId,
            qtId: vm.qt.qtId,
            stat: "I",
            QstItemNo: vm.it.length + 1,
            QstItemContents: wjmSurvey.txtQstItemContents,
            QstItemScore: "0",
            GoToQstId: "",
            ClassfyId: "",
            QstItemImgId: ""
          });
          break;

        // 우선순위형
        case "3":
          vm.it.push({
            itId: nextItId,
            qtId: vm.qt.qtId,
            stat: "I",
            QstItemNo: vm.it.length + 1,
            QstItemContents: wjmSurvey.txtQstItemContents,
            QstItemScore: "0",
            GoToQstId: "",
            ClassfyId: "",
            QstItemImgId: ""
          });
          break;

        // 이미지형
        case "4":
          vm.it.push({
            itId: nextItId,
            qtId: vm.qt.qtId,
            stat: "I",
            QstItemNo: vm.it.length + 1,
            QstItemContents: wjmSurvey.txtQstItemContents,
            QstItemScore: "0",
            GoToQstId: "",
            ClassfyId: "",
            QstItemImgId: ""
          });
          break;

        default : break;
      }

      if (vm.pageType == "FORM") vm.it[vm.it.length - 1].FormQstItemId = "";
      else vm.it[vm.it.length - 1].SvyQstItemId = "";
    };

    /**
     * 보기 삭제
     *
     * @param {string}
     * @return {boolean}
     */
    vm.setSvyQstItemDel = function (itId) {
      var it = [];
      var no = 0;

      gConfirm('', '선택한 보기를 삭제하고 보기번호를 순차적으로 재정의 하시겠습니까?', {
        btn: '',
        fn: function () {
          it = $filter('filter')(vm.it, {itId: itId}, true)[0];

          if (
            (vm.pageType == "FORM" && isNullOrEmpty(it.FormQstItemId))
            || (vm.pageType != "FORM" && isNullOrEmpty(it.SvyQstItemId))
          ) {
            vm.it.splice(vm.it.indexOf(it), 1);
          }
          else {
            it.stat = "D";
          }

          vm.it.forEach(function(i, idx) {
            no = idx + 1;
            if (i.QstItemNo != no) {
              i.stat = "U";
              i.QstItemNo = no;
            }
          });

          // 우선순위형인 경우
          if (vm.qt.QstType == "3" && vm.qt.QstTopCnt > vm.it.length) {
            vm.qt.stat = "U";
            vm.qt.QstTopCnt = vm.it.length;
          }
        }
      }, {
        btn: '',
        fn: function () {
          // 취소
        }
      });
    };

    /**
     * 문항,보기 클릭 이벤트
     *
     * @param {string}
     * @return {boolean}
     */
    vm.clickQstSubject = function () {
      if (vm.qt.QstSubject == wjmSurvey.txtQstSubject || vm.qt.QstSubject == wjmSurvey.txtQstSubjectR) vm.qt.QstSubject = "";
    };
    vm.clickQstItemContents = function (it) {
      if (it.QstItemContents == wjmSurvey.txtQstItemContents) it.QstItemContents = "";
    };
    vm.clickQstItemScore = function (it) {
      if (it.QstItemScore == "0") it.QstItemScore = "";
    };

    /**
     * 문항,보기 포커스아웃 이벤트
     *
     * @param {string}
     * @return {boolean}
     */
    vm.blurQstSubject = function () {
      if (vm.qt.QstType == "R" && vm.qt.QstSubject == "") vm.qt.QstSubject = wjmSurvey.txtQstSubjectR;
      else if (vm.qt.QstSubject == "") vm.qt.QstSubject = wjmSurvey.txtQstSubject;
    };
    vm.blurQstItemContents = function (it) {
      if (it.QstItemContents == "") it.QstItemContents = wjmSurvey.txtQstItemContents;
    };
    vm.blurQstItemScore = function (it) {
      if (it.QstItemScore == "") it.QstItemScore = "0";
    };

    /**
     * 이미지 파일 변경
     *
     * @param {string}
     * @return {boolean}
     */
    vm.chgQstImgId = function (qt) {
      var img = [];

      qt.qtImgSrc = "";
      if (isNullOrEmpty(qt.QstImgId)) return false;

      img = $filter('filter')(vm.imageList, {AttachmentId: qt.QstImgId}, true);
      if (img.length > 0) qt.qtImgSrc = StaticVariable.getUrl('/attach/file/' + img[0].PhysicalFileNm + '/download.do?userkey=' + $rootScope.gVariable.userKey);
    };

    vm.chgQstItemImgId = function (it) {
      var img = [];

      it.itImgSrc = "";
      if (isNullOrEmpty(it.QstItemImgId)) return false;

      img = $filter('filter')(vm.imageList, {AttachmentId: it.QstItemImgId}, true);
      if (img.length > 0) it.itImgSrc = StaticVariable.getUrl('/attach/file/' + img[0].PhysicalFileNm + '/download.do?userkey=' + $rootScope.gVariable.userKey);
    };

    /**
     * 필수항목 체크
     * @param
     * @return
     */
    /*
    function getIsValidData() {
      var errMsg = '';
      if (isNullOrEmpty(vm.data.QstNo)) {
        errMsg = errMsg + '- No를 입력하세요.<br/>';
      }

      if (isNullOrEmpty(vm.data.QstType)) {
        errMsg = errMsg + '- 구분을 선택하세요.<br/>';
      }

      if (isNullOrEmpty(vm.data.QstSubject)) {
        errMsg = errMsg + '- 제목을 입력하세요.<br/>';
      }

      if (vm.data.QstType == "300") {
        if (isNullOrEmpty(vm.data.QstItemScore)) {
          errMsg = errMsg + '- 배점을 입력하세요.<br/>';
        }
      }
      else {
        if (isNullOrEmpty(vm.qstItemLists)) {
          if (isNullOrEmpty(vm.data.NewQstItemNo)) {
            errMsg = errMsg + '- 항목 No를 입력하세요.<br/>';
          }

          if (isNullOrEmpty(vm.data.NewQstItemContents)) {
            errMsg = errMsg + '- 항목 내용을 입력하세요.<br/>';
          }

          if (isNullOrEmpty(vm.data.NewQstItemScore)) {
            errMsg = errMsg + '- 항목 배점을 입력하세요.<br/>';
          }
        }
        else {
          angular.forEach(vm.qstItemLists, function (item) {
            if (isNullOrEmpty(item.QstItemNo) || isNullOrEmpty(item.QstItemContents) || isNullOrEmpty(item.QstItemScore)) {
              errMsg = errMsg + '- 기존 문항항목 데이터중 빈항목이 존재합니다.<br/>';
            }
          });
        }
      }

      if (!isNullOrEmpty(errMsg)) {
        gAlert('', errMsg);
        return false;
      }

      return true;
    }
    */

    /**
     * 문항영역 목록
     * @param
     * @return
     */
    function getQstSecList() {
      var data = {
        mapCode: 'WjmSurvey.getQstSecDropListConcat',
        keyId : vm.SvyTypeId
      };

      postApi.select(data, function (result) {
        if(result.header.status == CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length > 0) {
            vm.qstSecList = result.body.docs;
          } else {
            vm.qstSecList = {};
          }
        }
      }, function(error) {
        console.error('Error> getQstSecList()', status, error);
      });
    }

    /**
     * 문항이미지 목록
     * @param
     * @return
     */
    function getImageList() {
      var data = {
        mapCode: 'WjmSurvey.getImageDropListConcat'
      };

      postApi.select(data, function (result) {
        if(result.header.status == CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length > 0) {

            vm.imageList = result.body.docs;

            vm.chgQstImgId(vm.qt);
            vm.it.forEach(function(i){
              vm.chgQstItemImgId(i);
            });
          }
        }
      }, function(error) {
        console.error('Error> getImageList()', status, error);
      });
    }

    /**
     * 분류정보 목록
     * @param
     * @return
     */
    function getClassfyList() {
      var data = {
        mapCode: 'WjmSurvey.getClassfyList',
        keyId : vm.ClassfyInfoId,
        pageType : 'wjmQstModal'
      };

      postApi.select(data, function (result) {
        if(result.header.status == CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length > 0) {

            //vm.classfyList = result.body.docs;
            result.body.docs.forEach(function(i) {
              vm.classfyList.push({
                ClassfyId: i.ClassfyId,
                ClassfyInfoId: i.ClassfyInfoId,
                ClassfyCd: i.ClassfyCd,
                ClassfyNm: i.ClassfyNm,
                ClassfyLevel: i.ClassfyLevel,
                SortSeq: i.SortSeq
              });
            });

            vm.classfyListLev1 = $filter('filter')(vm.classfyList, {ClassfyLevel: "1"}, true);
            vm.classfyListLev2 = $filter('filter')(vm.classfyList, {ClassfyLevel: "2"}, true);
          }
        }
      }, function(error) {
        console.error('Error> getClassfyList()', status, error);
      });
    }

    /**
     * 공통 분류정보 삽입
     * @param
     * @return
     */
    function setClassfyCommon() {
      // 공통 분류 삽입
      vm.classfyList.push({
        ClassfyId: "GD",
        ClassfyInfoId: "",
        ClassfyCd: "",
        ClassfyNm: "성별",
        ClassfyLevel: "1",
        SortSeq: vm.classfyList.length + 1
      });

      vm.classfyList.push({
        ClassfyId: "MB",
        ClassfyInfoId: "",
        ClassfyCd: "",
        ClassfyNm: "휴대폰",
        ClassfyLevel: "1",
        SortSeq: vm.classfyList.length + 1
      });

      vm.classfyList.push({
        ClassfyId: "EM",
        ClassfyInfoId: "",
        ClassfyCd: "",
        ClassfyNm: "이메일",
        ClassfyLevel: "1",
        SortSeq: vm.classfyList.length + 1
      });
    }

    /**
     * 적용 버튼 이벤트
     *
     * @param
     * @return
     */
    function apply() {
      var i = 0;
      var classfyLev2 = [];
      var pQt = [];
      var pIt = [];
      var it = [];

      // 기존 데이터 배열 삭제
      /*
      for (i = toModalData.svyQsts.length - 1; i >= 0; i--) {
        if (toModalData.svyQsts[i].qtId == vm.qt.qtId) toModalData.svyQsts.splice(i, 1);
      }
      */
      for (i = toModalData.svyQstItems.length - 1; i >= 0; i--) {
        if (toModalData.svyQstItems[i].qtId == vm.qt.qtId) {
          if (vm.qt.QstType == "C") {
            if (vm.qt.ClassfyCd != vm.oClassfyCd) {
              if ((vm.pageType == "FORM" && isNullOrEmpty(toModalData.svyQstItems[i].FormQstItemId))
                || (vm.pageType != "FORM" && isNullOrEmpty(toModalData.svyQstItems[i].SvyQstItemId))
              ) {
                toModalData.svyQstItems.splice(i, 1);
              }
              else {
                toModalData.svyQstItems[i].stat = "D";
              }
            }
          }
          else {
            toModalData.svyQstItems.splice(i, 1);
          }
        }
      }

      pQt = $filter('filter')(toModalData.svyQsts, {qtId: vm.qt.qtId}, true)[0];

      // 입력 데이터 추가
      switch (vm.qt.QstType) {

        // 선택형
        case "1":
          pQt.stat = "U";
          pQt.QstSubject = vm.qt.QstSubject;
          pQt.QstSecId = vm.qt.QstSecId;

          vm.it.forEach(function(j) {
            if (isNullOrEmpty(j.stat)) j.stat = "U";
            toModalData.svyQstItems.push(j);
          });

          break;

        // 입력형
        case "2":
          pQt.stat = "U";
          pQt.QstSubject = vm.qt.QstSubject;

          break;

        // 우선순위형
        case "3":
          pQt.stat = "U";
          pQt.QstSubject = vm.qt.QstSubject;
          pQt.QstTopCnt = vm.qt.QstTopCnt;

          vm.it.forEach(function(j) {
            if (isNullOrEmpty(j.stat)) j.stat = "U";
            toModalData.svyQstItems.push(j);
          });

          break;

        // 이미지형
        case "4":
          pQt.stat = "U";
          pQt.QstSubject = vm.qt.QstSubject;
          pQt.QstSecId = vm.qt.QstSecId;
          pQt.QstImgId = vm.qt.QstImgId;
          pQt.qtImgSrc = vm.qt.qtImgSrc;

          vm.it.forEach(function(j) {
            if (isNullOrEmpty(j.stat)) j.stat = "U";
            toModalData.svyQstItems.push(j);
          });

          break;

        // 분류정보
        case "C":
          pQt.stat = "U";
          pQt.QstSubject = vm.qt.QstSubject;
          pQt.ClassfyCd = vm.qt.ClassfyCd;

          if (vm.qt.ClassfyCd != vm.oClassfyCd) {
            classfyLev2 = $filter('filter')(vm.classfyListLev2, {ClassfyCd: vm.qt.ClassfyCd}, true);

            vm.it = [];
            for (i = 0; i < classfyLev2.length; i++) {
              vm.it.push({
                itId: wjmSurvey.getSvyCode("IT", vm.svyQsts, vm.svyQstItems),
                qtId: vm.qt.qtId,
                stat: "I",
                QstItemNo: vm.it.length + 1,
                QstItemContents: classfyLev2[i].ClassfyNm,
                QstItemScore: "0",
                GoToQstId: "",
                ClassfyId: classfyLev2[i].ClassfyId
              });

              if (vm.pageType == "FORM") vm.it[i].FormQstItemId = "";
              else vm.it[i].SvyQstItemId = "";

              toModalData.svyQstItems.push(vm.it[i]);
            }
          }

          break;

        // 설명글
        case "R":
          pQt.stat = "U";
          pQt.QstSubject = vm.qt.QstSubject;

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
