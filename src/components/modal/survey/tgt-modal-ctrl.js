webapp.controller('TgtModalCtrl', [ '$window', '$rootScope', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', 'gAlert', 'gConfirm', 'modalFactory',
  function TgtModalCtrl($window, $rootScope, $scope, $uibModalInstance, toModalData, CONSTANT, postApi, gAlert, gConfirm, modalFactory) {
    var vm = this;

    // html 에서 사용하는 함수 연결
    vm.ok = ok;
    vm.cancel = cancel;
    vm.getData = getData;
    vm.setData = setData;

    (function TgtModalCtrl() {
      vm.srch = {
        keyId: toModalData.keyId,
        tgtType: toModalData.tgtType
      };

      vm.data = {};
      vm.data.TgtCnt = 0;

      if (isNullOrEmpty(vm.srch.keyId)) cancel();

      if (vm.srch.tgtType == "100") {
        vm.pageTitle = "테스트대상자(마스터)";
        getCommonCodeList("USERGRADE");
      }
      else {
        vm.pageTitle = "테스트대상자(멤버)";
        getCommonCodeList("CUSTGRADE");
      }
    })();

    /**
     * 회원사 검색 팝업 호출
     *
     * @param {string}
     * @return {boolean}
     */
    vm.srchTenantModal = function () {
      var ctrl = 'TenantModalCtrl as vc';
      var paramData = {TenantId: vm.srch.TenantId};
      var modalInstance = modalFactory.open('modal', 'components/modal/tenant/tenant-modal.html', ctrl, paramData);

      modalInstance.result.then(function (okData) {
        // 회원사 선택
        vm.srch.TenantNm = okData.TenantNm;
        vm.srch.TenantId = okData.TenantId;
      }, function (cancelData) {
        // 취소
      });
    };

    /**
     * 회원사 초기화
     *
     * @param {string}
     * @return {boolean}
     */
    vm.eraseTenant = function () {
      /*
      if (vm.TenantId != '0') {
        return;
      }
      */
      vm.srch.TenantNm = "";
      vm.srch.TenantId = "";
    };

    /**
     * 공통코드 목록
     *
     * @param
     * @return
     */
    function getCommonCodeList(codeType) {
      var data = vm.srch;

      vm.srch.CodeType = codeType;
      data.mapCode = 'CommonCode.getCommonCodeList';

      postApi.select(data, function (result) {
        if(result.header.status == CONSTANT.HttpStatus.OK) {

          switch (codeType) {
            case "CUSTGRADE" :
              vm.CustGradeCodeList = result.body.docs;
              getCommonCodeList("GENDER");
              break;
            case "GENDER" :
              vm.GenderCodeList = result.body.docs;
              break;
            case "USERGRADE" :
              vm.UserGradeCodeList = result.body.docs;
              break;
            default : break;
          }
        }
      });
    }

    /**
     * 추출
     *
     * @param
     * @return
     */
    function getData() {
      if (getIsValidData() == false) return;

      var data = vm.srch;
      data.mapCode = 'Survey.getSurveyTargetExtract';

      postApi.select(data, function (result) {
        if (result.header.status == CONSTANT.HttpStatus.OK) {

          if (result.body.docs.length > 0) {
            vm.data.TgtCnt = result.body.docs[0].TgtCnt;
          } else {
            vm.data.TgtCnt = 0;
          }
        }
      });
    }

    /**
     * 추가
     *
     * @param
     * @return
     */
    function setData() {
      if (getIsValidData() == false) return;

      if (isNullOrEmpty(vm.data.TgtCnt) || vm.data.TgtCnt == "0") {
        gAlert("", "추출대상이 0명입니다.");
        return;
      }

      var data = vm.srch;

      data.mapCode = 'Survey.updateSurveyTargetExtract';

      postApi.insert(data, function (result) {
        setInsertUpdateDetail(result);
      }, function (error) {
        console.error("Error> setData()");
        console.table(error);
      });
    }

    /**
     * 추가 후 처리
     *
     * @param result - 저장 결과
     * @return
     */
    function setInsertUpdateDetail(result) {
      if (result.header.status === CONSTANT.HttpStatus.OK) {
        gAlert("", "Menu.SAVED", {
          btn: "",
          fn: function () {
            ok();
          }
        });
        return;
      }

      console.error("Error> setInsertUpdateDetail()");
      gAlert('', result.body.docs[0].errMessage);
    }

    /**
     * 필수항목 체크
     * @param
     * @return
     */
    function getIsValidData() {
      var errMsg = '- 검색조건을 하나 이상 입력하세요.<br/>';
      var isErr = false;

      if (vm.srch.tgtType == "100") {
        if (
          isNullOrEmpty(vm.srch.UserNm)
          && isNullOrEmpty(vm.srch.Mobile)
          && isNullOrEmpty(vm.srch.UserGrade)
          && isNullOrEmpty(vm.srch.Addr1)
          && isNullOrEmpty(vm.srch.AgeFrom)
          && isNullOrEmpty(vm.srch.AgeTo)
          && isNullOrEmpty(vm.srch.TenantId)
        ) {
          isErr = true;
        }
      }
      else {
        if (
          isNullOrEmpty(vm.srch.CustNm)
          && isNullOrEmpty(vm.srch.Mobile)
          && isNullOrEmpty(vm.srch.Gender)
          && isNullOrEmpty(vm.srch.CustGrade)
          && isNullOrEmpty(vm.srch.AgeFrom)
          && isNullOrEmpty(vm.srch.AgeTo)
          && isNullOrEmpty(vm.srch.Addr1)
          && isNullOrEmpty(vm.srch.TenantId)
        ) {
          isErr = true;
        }
      }

      if (isErr) {
        gAlert('', errMsg);
        return false;
      }

      return true;
    }

    /**
     * 취소 버튼 이벤트
     *
     * @param
     * @return
     */
    function cancel() {
      $uibModalInstance.dismiss('cancel data');
    }

    /**
     * 성공 이벤트
     *
     * @param
     * @return
     */
    function ok() {
      $uibModalInstance.close(null);
    }
  } ]);
