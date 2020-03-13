webapp.controller('ScoLvContModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi', 'gAlert', '$rootScope', 'modalFactory', 'gConfirm', '$filter', '$translate',
  function ScoLvContModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi, gAlert, $rootScope, modalFactory, gConfirm, $filter, $translate) {

    var vm = this;
    vm.dataloader = false;

    var VIEW_SQL = 'WjmSurvey.getScoLvCont'; // 조회 SQL
    var UPDATE_SQL = 'WjmSurvey.updateScoLvCont';     // 수정 SQL

    vm.data = {
      ScoreLvTotId : toModalData.ScoreLvTotId,
      LvCont : ''
    };

    // 조회
    function getData() {
      vm.dataloader = true;

      var data = vm.data;
      data.mapCode = VIEW_SQL;

      postApi.select(data, function (result) {
        if (result.header.status == CONSTANT.HttpStatus.OK) {
          vm.dataloader = false;

          if (result.body.docs.length > 0) {
            vm.data = result.body.docs[0];
            if(isNullOrEmpty(vm.data.LvCont)){
              vm.data.LvCont = "이 내용은 기본으로 세팅되는 값입니다."
                                  + "<br><br>귀하의 점수는 {TOTSCORE}입니다."
                                  + "<br><a href='{LINKCOUNSEL}'>상담신청</a>"
                                  + "<br><a href='tel:전화번호'>상담전화걸기</a>";
            }

          } else {
            console.log('nodata');
          }
        }
      }, function (error) {
        console.error("Error> getData()");
        console.table(error);
      });
    }

    // 저장
    function setData() {
      vm.dataloader = true;

      var data = vm.data;
      data.mapCode = UPDATE_SQL;
      oEditors.getById["strHtml"].exec("UPDATE_CONTENTS_FIELD", []);
      data.LvCont = $("#strHtml").val();

      postApi.update(data, function (result) {
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          gAlert("", "Menu.SAVED", {
            btn: "",
            fn: function () {
            }
          });
        }
      }, function (error) {
        console.error("Error> setData()");
        gAlert('', 'Menu.EXCEPTIONOCCURED');
      });
    }

    // 닫기
    function closeWin() {
      $uibModalInstance.close();
    }

    // 함수 선언
    vm.setData = setData;
    vm.closeWin = closeWin;

    getData();

}, ]);
