(function() {
  "use strict";
  CounselController.$inject = ['$state', '$filter', '$rootScope', 'CounselAPISrv', 'GLOBAL_CONSTANT', 'gAlert', '$window', '$translate','modalFactory', '$stateParams', 'StaticVariable'];

  /** @ngInject */
  function CounselController($state, $filter, $rootScope, api, CONSTANT, gAlert, $window, $translate, modalFactory, $stateParams, StaticVariable) {
    var vm = this;

    //테스트 URL
    //http://localhost:3000/#/counsel/ZG3D62R5S

    //vm.data = {};
    vm.srch = {};
    vm.srch.SvyTgtId = $stateParams.tgtId;

    if (!isNullOrEmpty(vm.srch.SvyTgtId)) {
      setData();
    }
    else {
      setMsg();
    }

    /**
     * 화면 메세지 변경
     * @param
     * @return
     */
    function setMsg(msg) {
      vm.msg = isNullOrEmpty(msg) ? "오류가 발생하였습니다." : msg;
    }

    /**
     * 상담신청 저장
     * @param
     * @return
     */
    function setData() {
      var prms;
      var param = angular.copy(vm.srch);

      prms = api.insertCounsel().post(param).$promise;
      prms.then(function(data) {
        if (data && data.responseVO && data.responseVO.header.status == CONSTANT.HttpStatus.OK) {
          if (data.responseVO.body.docCnt > 0) {
            if (data.responseVO.body.docs[0].RegCnt == "0") setMsg("상담신청이 완료되었습니다.");
            else setMsg("이미 상담신청 처리되었습니다.");
          }
          else {
            setMsg();
          }
        } else {
          setMsg("상담신청이 완료되었습니다.");
          console.error("Error> setData(1)");
        }
      }, function (error) {
        setMsg();
        console.error("Error> setData(2)");
        console.table(error);
      });
    }
  }

  webapp.component("counsel", {
    transclude: true,
    bindings: {},
    controller: CounselController,
    controllerAs: "counsel",
    templateUrl: "components/survey/counsel.html"
  });
})();
