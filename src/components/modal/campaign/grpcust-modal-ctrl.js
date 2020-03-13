webapp.controller('GrpcustModalCtrl', [ '$window', '$rootScope', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', 'gAlert', 'gConfirm', 'modalFactory',
  function GrpcustModalCtrl($window, $rootScope, $scope, $uibModalInstance, toModalData, CONSTANT, postApi, gAlert, gConfirm, modalFactory) {
    var vm = this;

    // html 에서 사용하는 함수 연결
    vm.ok = ok;
    vm.cancel = cancel;
    vm.getData = getData;
    vm.setData = setData;

    (function GrpcustModalCtrl() {
      vm.srch = {
        keyId: toModalData.keyId
      };

      vm.data = {};
      vm.data.CustCnt = 0;

      if (isNullOrEmpty(vm.srch.keyId)) cancel();

      getCommonCodeList("CUSTGRADE");
    })();

    /**
     * 담당자 검색 팝업 호출
     *
     * @param {string}
     * @return {boolean}
     */
    vm.srchUserModal = function () {
      var ctrl = 'UserModalCtrl as modalCtrl';
      var paramData = {srchTenantId: $rootScope.gVariable.srchTenantId};
      var modalInstance = modalFactory.open('lg', 'components/modal/users/user-modal.html', ctrl, paramData);

      modalInstance.result.then(function (okData) {
        // 사용자 선택
        vm.srch.ManagerNm = okData.UserNm;
        vm.srch.Manager = okData.UserId;
      }, function (cancelData) {
        // 취소
      });
    };

    /**
     * 담당자 초기화
     *
     * @param {string}
     * @return {boolean}
     */
    vm.eraseUser = function () {
      vm.srch.ManagerNm = "";
      vm.srch.Manager = "";
    };

    /**
     * 문제유형코드 목록
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
              getCommonCodeList("VISITPATH");
              break;
            case "VISITPATH" :
              vm.VisitPathCodeList = result.body.docs;
              break;
            default : break;
          }
        }
      });
    }

    /**
     * 그룹고객 추출
     *
     * @param
     * @return
     */
    function getData() {
      if (getIsValidData() == false) return;

      var data = vm.srch;
      data.mapCode = 'Campaign.getGroupcustomerExtract';

      postApi.select(data, function (result) {
        if (result.header.status == CONSTANT.HttpStatus.OK) {

          if (result.body.docs.length > 0) {
            vm.data.CustCnt = result.body.docs;
          } else {
            vm.data.CustCnt = 0;
          }
        }
      });
    }

    /**
     * 그룹고객 추가
     *
     * @param
     * @return
     */
    function setData() {
      if (getIsValidData() == false) return;

      if (isNullOrEmpty(vm.data.CustCnt) || vm.data.CustCnt == "0") {
        gAlert("", "추출고객수가 0명입니다.");
        return;
      }

      var data = vm.srch;

      data.mapCode = 'Campaign.updateGroupcustomerExtract';

      postApi.insert(data, function (result) {
        setInsertUpdateDetail(result);
      }, function (error) {
        console.error("Error> setData()");
        console.table(error);
      });
    }

    /**
     * 그룹고객 추가 후 처리
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
      var errMsg = '';

      if (
        isNullOrEmpty(vm.srch.CustNm)
        && isNullOrEmpty(vm.srch.Mobile)
        && isNullOrEmpty(vm.srch.CustGrade)
        && isNullOrEmpty(vm.srch.VisitPath)
        && isNullOrEmpty(vm.srch.ManagerNm)
      ) {
        errMsg = errMsg + '- 검색조건을 하나 이상 입력하세요.<br/>';
      }

      if (!isNullOrEmpty(errMsg)) {
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
