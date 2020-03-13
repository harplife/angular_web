webapp.controller('ScoreLvTotModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi', 'gAlert', '$rootScope', 'modalFactory', 'gConfirm', '$filter', '$translate',
  function ScoreLvTotModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi, gAlert, $rootScope, modalFactory, gConfirm, $filter, $translate) {

    var vm = this;

    vm.dataloader = false;

    var LIST_SQL = 'WjmSurvey.getScoreLvTotList';
    var MODIFY_SQL = 'WjmSurvey.insertScoreLvTotDetailBatch';
    var SEC_LIST_SQL = 'WjmSurvey.getQstSecDropList';
    var LV_LIST_SQL = 'WjmSurvey.getScoreLvDropList';
    var CD_LIST_SQL = 'CommonCode.getCommonCodeList';

    vm.srch = {
      SvyTypeId : toModalData.svyTypeId,
      SvyTypeNm : toModalData.svyTypeNm,
      srchTenantId : toModalData.srchTenantId,
    };
    vm.lists = [];
    vm.secHeader = [];
    vm.lvList = [];
    vm.secLen = 0;

    // 조회
    function getList() {

      // 성별,영역별 기준점 조회
      getCodeList('SECLV');

      vm.dataloader = true;

      var data = vm.srch;
      data.mapCode = LIST_SQL;
      postApi.select(data, function (result) {

        if (result.header.status === CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length > 0) {
            vm.lists = result.body.docs;
          } else {
            vm.lists = [];
          }
        }
        vm.dataloader = false;
      }, function(error) {
        console.error('Error-getList', status, data);
        vm.dataloader = false;
      });
    }

    // 저장
    function saveList() {

      if(!$scope.form1.$valid) {
        return false;
      }

      vm.dataloader = true;

      var data = {lists : []};
      angular.forEach(vm.lists, function(item) {
        data.lists.push(item);
      });

      if (data.lists.length == 0) {
        return;
      }

      data.mapCode = MODIFY_SQL;

      postApi.insert(data, function(result) {
        vm.dataloader = false;
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          $rootScope.showSimpleToast($translate.instant('Menu.SAVED'));
          getList();
        }
      }, function(error) {
        console.error('Error-saveList', status, data);
        vm.dataloader = false;
      });
    }

    // 행 추가
    function addNew() {
      var newnum = Math.floor(Math.random() * 899999999999999 + 100000000000000);

      var item = {
        KeyId : newnum.toString(36),
        SvyTypeId : vm.srch.SvyTypeId,
        LvCd01 : '',
        LvCd02 : '',
        LvCd03 : '',
        LvCd04 : '',
        LvCd05 : '',
        LvCd : '',
        isNew:'Y',
      };
      vm.lists.push(item);
    }

    // 행 삭제
    function checkChanged(li) {
      if (li.DelYN == 'Y') {
        if (li.isNew == 'Y') {
          angular.forEach(vm.lists, function(item, key) {
            if (item.KeyId == li.KeyId) {
              console.log(item, key);
              vm.lists.splice(key, 1);
            }
          });
        }
      }
    }

    // 선택 목록 조회
    function getCodeList(type) {
      var data = vm.srch;

      switch(type) {
        case "SEC" : data.mapCode = SEC_LIST_SQL; break;
        case "SECLV" : data.mapCode = LV_LIST_SQL; break;
        case "LV" : data = {CodeType : 'ScoreLv', mapCode : CD_LIST_SQL}; break;
      }

      postApi.select(data, function (result) {
        if (result.header.status === CONSTANT.HttpStatus.OK) {

          switch(type) {

            // 문항영역
            case "SEC" :
              vm.qstSecList = result.body.docs;
              vm.secLen = vm.qstSecList.length;
              break;

            // 영역별 기준점
            case "SECLV" :
              var lvListAll = result.body.docs;
              var i = 0;
              angular.forEach(vm.qstSecList, function(sec) {
                vm.secHeader[i] = sec.QstSecId;
                vm.lvList[i] = $filter('filter')(lvListAll, {QstSecId: sec.QstSecId}, true);
                i++;
              });
              break;

            // 최종등급
            case "LV" :
              vm.scoreLvList = result.body.docs;
              break;
          }
        }
      }, function (error) {
        // 조회 중 오류 발생
        console.error("Error> getQstSecList()");
        console.table(error);
      });
  }

  // 닫기
  function closeWin() {
    $uibModalInstance.close();
  }

  // 미니결과 편집
  function goEditLvCont(id) {
    var ctrl = 'ScoLvContModalCtrl as vc';
    var paramData = {
      ScoreLvTotId: id
    };
    var modalInstance = modalFactory.open('lg', 'components/modal/survey/wjm-scorelv-lvcont-modal.html', ctrl, paramData);
    modalInstance.result.then(function (okData) {
      // 성공
    }, function (cancelData) {
      // 취소
    });
  }


  // 함수 선언
  vm.getList = getList;
  vm.saveList = saveList;
  vm.addNew = addNew;
  vm.checkChanged = checkChanged;
  vm.closeWin = closeWin;
  vm.goEditLvCont = goEditLvCont;

  getCodeList('GD');
  getCodeList('SEC');
  getCodeList('LV');

  getList();

}, ]);
