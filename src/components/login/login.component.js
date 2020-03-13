(function() {
  "use strict";
  LoginController.$inject = ['$log', '$state', '$filter', '$cookies', '$rootScope', 'MAIN', 'LoginAPISrv', 'GLOBAL_CONSTANT', 'gAlert', '$window', '$translate','modalFactory', 'Auth'];

  /** @ngInject */
  function LoginController($log, $state, $filter, $cookies, $rootScope, MAIN, loginApi, CONSTANT, gAlert, $window, $translate, modalFactory, Auth) {
    var vm = this;
    vm.user = {};
    vm.loginInfo = {};

    if($cookies.get('mySavedId') != undefined) {
      vm.loginInfo.loginId = $cookies.get('mySavedId');
      vm.loginInfo.saveId = '1';
    }


    var translate = $filter("translate");
    vm.language = $rootScope.currentLanguage;
    console.log('$rootScope.currentLanguage=', $rootScope.currentLanguage);
    vm.placeholder = {
      id: translate("LOGIN.LABEL.ID"),
      pw: translate("LOGIN.LABEL.PW")
    };
    $log.info("console log info translate::", translate("LOGIN.BTN.LOGIN"));

    vm.findIdPwd = findIdPwd;
    vm.doLogin = doLogin;
    vm.onChangeHandler = onChangeHandler;

    function doLogin() {
      vm.appName = MAIN.APP_NAME;

      var prms = loginApi.doLogin().post(vm.loginInfo).$promise;

      prms.then(function(data) {
        if (data && data.responseVO && data.responseVO.header.status == CONSTANT.HttpStatus.OK) {
          if (data.responseVO.body.docCnt > 0) {
            setUserSession(vm, data);

            var srch = '';
            if (data.responseVO.body.docs[0].mainpagesrch) {
              srch = encodeURIComponent(data.responseVO.body.docs[0].mainpagesrch);
            }
            $state.go(data.responseVO.body.docs[0].mainpage, {srch: srch});
//            $window.location.replace('/#' + data.responseVO.body.docs[0].mainpage);

            // Auth.init(data.permissions);

            // 이메일, 전화번호 추가
            // $window.sessionStorage['loginUserEmail'] =
            // json.responseVO.body.docs[0].email;

            // $window.location.replace('/app/dashboard');
            // $state.reload("home");
            //$window.location.replace('/');
            // $state.go("app.dashboard");

          } else {
            gAlert('', 'Menu.INVALIEDIDPASSWORD');
          }
        } else {

          if(data.responseVO.body.docs.length > 0 && data.responseVO.body.docs[0].checkApproval == "N") {
            gAlert('', data.responseVO.body.docs[0].MSG, {
              btn: '확인', fn: function () { }
            });
          } else {
            gAlert('', '로그인에 실패하였습니다. 다시 시도하여주세요.', {
              btn: '확인', fn: function () { }
            });
          }
        }
      }, function(error) {
        gAlert('', error);
        console.error('fail', status);
      });

      $log.info("account::", vm.loginInfo.account);
      $log.info("secureCode::", vm.loginInfo.secureCode);
      // $state.go("app.dashboard");
    }

    function onChangeHandler() {
      console.log('language=', vm.language);
      $rootScope.changeLanguage(vm.language);
    }

    function setUserSession(vm, json) {
      if (vm.loginInfo.saveId == '1') {
        var now = new Date();
        var cookieExp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());

        $cookies.put('mySavedId', vm.loginInfo.loginId);

      } else {
        $cookies.remove('mySavedId');
      }

      $rootScope.setUserSession(json.responseVO.body.docs[0]);

      Auth.init(json.responseVO.body.docs[0].permissions);

//      Auth.init(json.responseVO.body.docs[0].permissions);

      // 이메일, 전화번호 추가
      // $window.sessionStorage['loginUserEmail'] =
      // json.responseVO.body.docs[0].email;

      // $window.location.replace('/app/dashboard');
      // $state.reload("home");

      // $state.go("app.dashboard");
    }

    function findIdPwd(find){
      var ctrl = 'FindIdPwdModalCtrl as modalCtrl';
      var paramData = { find : find };
      var modalInstance = modalFactory.open('modal', 'components/modal/findIdPwd/findIdPwd-modal.html', ctrl, paramData);
    }

/*     function getCookieId(){
      var userInputId = getCookie("userInputId");
      if(userInputId != null) {
        vm.loginInfo.loginId = userInputId;
        vm.ckId = true;
      } else {
        vm.loginInfo.loginId = '';
        vm.ckId = false;
      }

    } */
  }

  webapp.component("login", {
    transclude: true,
    bindings: {},
    controller: LoginController,
    controllerAs: "login",
    templateUrl: "components/login/login.html"
  });

  webapp.component("salemeet", {
    transclude: true,
    bindings: {},
    controller: LoginController,
    controllerAs: "login",
    templateUrl: "components/login/salemeet.html"
  });

  webapp.component("winnersjm", {
    transclude: true,
    bindings: {},
    controller: LoginController,
    controllerAs: "login",
    templateUrl: "components/login/winnersjm.html"
  });
})();
