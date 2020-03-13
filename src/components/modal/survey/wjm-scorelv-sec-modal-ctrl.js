webapp.controller('ScoreLvSecModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi', 'gAlert', '$rootScope', 'modalFactory', 'gConfirm', '$filter', '$translate',
  function ScoreLvSecModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi, gAlert, $rootScope, modalFactory, gConfirm, $filter, $translate) {

    var vm = this;

    vm.dataloader = false;

    var LIST_SQL = 'WjmSurvey.getScoreLvSecList';
    var MODIFY_SQL = 'WjmSurvey.insertScoreLvSecDetailBatch';
    var SEC_LIST_SQL = 'WjmSurvey.getQstSecDropList';

    vm.srch = {
      QstSecId : '',
      SvyTypeId : toModalData.svyTypeId,
      SvyTypeNm : toModalData.svyTypeNm,
      srchTenantId : toModalData.srchTenantId
    };
    vm.lists = [];

    // 조회
    function getList() {
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
        QstSecId : vm.srch.QstSecId,
        LvNum : '',
        LvCd : '',
        LvTxt : '',
        LvColor : '',
        Gender : '',
        MinScore : '',
        MaxScore : '',
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

    // 문항영역 선택 목록 조회
    function getQstSecList () {
      var data = vm.srch;
      data.mapCode = SEC_LIST_SQL;
      postApi.select(data, function (result) {
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          vm.qstSecList = result.body.docs;
        }
      }, function (error) {
        // 조회 중 오류 발생
        console.error("Error> getQstSecList()");
        console.table(error);
      });
  }

  // 성별 공통코드 목록 조회
  function getCodeList(type) {
    var data = {CodeType : type, mapCode : 'CommonCode.getCommonCodeList'};
    postApi.select(data, function (result) {
      if(result.header.status == CONSTANT.HttpStatus.OK) {
        switch(type) {
          case "ScoreLv" : vm.scoreLvList = result.body.docs; break;
          case "GENDER" : vm.genderList = result.body.docs; break;
        }
      }
    });
  }

  // 닫기
  function closeWin() {
    $uibModalInstance.close();
  }


    // 함수 선언
    vm.getList = getList;
    vm.saveList = saveList;
    vm.addNew = addNew;
    vm.checkChanged = checkChanged;
    vm.closeWin = closeWin;

    getQstSecList();
    getCodeList('ScoreLv');
    getCodeList('GENDER');
    getList();

  }, ]);
