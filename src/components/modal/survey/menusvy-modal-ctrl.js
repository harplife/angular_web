webapp.controller('MenusurveyModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'gAlert', 'postApi',
  function MenusurveyModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, gAlert, postApi) {
    var vm = this;
    vm.close = close;
    vm.ok = ok;
    vm.getList = getList;
    vm.setData = setData;
    vm.currentPage = 1;
    vm.maxSize = 10;

    vm.srch = {
      SvyNm : '',
      SvyType : '',
      viewSize : 10,
      keyId: toModalData.keyId,
    };

    vm.selectedTenantId = toModalData.TenantId;

    (function MenusurveyModalCtrl() {
      getList();
      getSvyTypeCodeList();

      if (isNullOrEmpty(vm.srch.keyId)) close();
    })();

    function getList() {
      getCnt();
      var data = {
        mapCode: 'Survey.getSurveyList',
        SvyNm : vm.srch.SvyNm,
        SvyType : vm.srch.SvyType,
        userkey : '',
        page : vm.srch.page
      };

      postApi.select(data, function (result) {
        if(result.header.status == CONSTANT.HttpStatus.OK) {
          vm.svyLists = result.body.docs;
        }
      });
    }

    function getCnt() {
      var data = {
        mapCode: 'Survey.getSurveyListCnt',
        CustNm : vm.srch.CustNm,
        Mobile : vm.srch.Mobile,
        userkey : '',
      };

      postApi.select(data, function (result) {
        if(result.header.status == CONSTANT.HttpStatus.OK) {
          vm.totalItems = result.body.docs[0].totalItems;
        }
      });
    }

    /**
     * 공통코드 목록 (구분)
     *
     * @param
     * @return
     */
    function getSvyTypeCodeList() {
      var data = vm.srch;

      if (!isNullOrEmpty(vm.SvyTypeCodeList)) return;

      vm.srch.CodeType = "SVYTYPE";
      data.mapCode = 'CommonCode.getCommonCodeList';

      postApi.select(data, function (result) {
        if(result.header.status == CONSTANT.HttpStatus.OK) {
          vm.SvyTypeCodeList = result.body.docs;
        }
      });
    }

    /**
     * 선택설문 추가
     *
     * @param
     * @return
     */
    function setData() {
      vm.srch.KeyIdList = [];

      for (var i = 0; i < vm.svyLists.length; i++) {
        if (vm.svyLists[i].svyChkRow)
        {
          vm.srch.KeyIdList.push(vm.svyLists[i].KeyId);
        }
      }

      if (vm.srch.KeyIdList == null || vm.srch.KeyIdList.length == 0)
      {
        gAlert('', '추가할 설문을 선택해주세요.');
        return false;
      }

      var data = {};
      data = vm.srch;
      data.mapCode = "Survey.updateMenusurveyList";

      postApi.update(data, function (result) {
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          gAlert('', 'Menu.SAVED', {
            btn : '',
            fn : function() {
              ok();
            }
          });
        }
      }, function (error) {
        console.error("Error> setData()");
        console.table(error);
      });
    }

    function close() {
      $uibModalInstance.dismiss('close data');
    }

    function ok(item) {
      $uibModalInstance.close(item);
    }

    /**
     * 페이지 변경시 데이터 조회
     * @param
     * @return
     */
    function pageChanged() {
      vm.srch.page = vm.currentPage;
      getList();

    }

    /**
     * 목록 체크박스 로직 설정
     * @param
     * @return
     */
    vm.svyChkHead = false;
    $scope.svyChkRowChg = function () {
      for (var i = 0; i < vm.svyLists.length; i++) {
        if (!vm.svyLists[i].isChecked) {
          vm.svyChkHead = false;
          return;
        }
      }
      vm.svyChkHead = true;
    };

    $scope.svyChkHeadChg = function () {
      for (var i = 0; i < vm.svyLists.length; i++) {
        vm.svyLists[i].svyChkRow = vm.svyChkHead;
      }
    };

    vm.pageChanged = pageChanged;
  } ]);
