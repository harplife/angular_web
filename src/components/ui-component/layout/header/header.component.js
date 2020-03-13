(function () {
  'use strict';
  HeaderController.$inject = ['$log', '$state', '$filter', '$cookies', '$rootScope', 'MAIN', 'LoginAPISrv', 'GLOBAL_CONSTANT', 'gAlert', '$window', 'StaticVariable', 'Auth', 'modalFactory'];

  /** @ngInject */
  function HeaderController($log, $state, $filter, $cookies, $rootScope, MAIN, loginApi, CONSTANT, gAlert, $window, StaticVariable, Auth, modalFactory) {
    var vm = this;

    vm.srch = {};
    var translate = $filter("translate");

    //$log.info("console log info translate::", translate("LOGIN.BTN.LOGIN"));

    vm.loginInfo = {};
    vm.doLogin = doLogin;
    vm.isLogin = isLogin;
    vm.doLogout = doLogout;
    vm.doCheckSession = doCheckSession;
    vm.checkUse = false;
    vm.paddingTop = 40;

    vm.TENANTID = "";
    vm.TENANTNAME = "";
    if ($window.sessionStorage['loginSysAdminYN'] == "Y") {
      if($window.sessionStorage['srchTenantId'] == undefined) {
        vm.TENANTID = $window.sessionStorage['loginTenantId'];
        vm.TENANTNAME = $window.sessionStorage['loginTenantName'];
        $window.sessionStorage.setItem('srchTenantId', $window.sessionStorage['loginTenantId']);
        $window.sessionStorage.setItem('srchTenantName', $window.sessionStorage['loginTenantName']);
        $rootScope.gVariable.srchTenantId = $window.sessionStorage['loginTenantId'];
        $rootScope.gVariable.srchTenantName = $window.sessionStorage['loginTenantName'];
      } else {
        vm.TENANTID = $window.sessionStorage['srchTenantId'];
        vm.TENANTNAME = $window.sessionStorage['srchTenantName'];
        $rootScope.gVariable.srchTenantId = $window.sessionStorage['srchTenantId'];
        $rootScope.gVariable.srchTenantName = $window.sessionStorage['srchTenantName'];
      }
      vm.checkUse = true;
    }

    vm.srchTenantModal = function() {
      var ctrl = 'TenantModalCtrl as vc';
      var paramData = {TenantId:$rootScope.gVariable.srchTenantId}
      var modalInstance = modalFactory.open('modal', 'components/modal/tenant/tenant-modal.html', ctrl, paramData);
      modalInstance.result.then(function(okData) {
        vm.TENANTID = okData.TenantId;
        vm.TENANTNAME = okData.TenantNm;
        $window.sessionStorage.setItem('srchTenantId', okData.TenantId);
        $window.sessionStorage.setItem('srchTenantName', okData.TenantNm);
        $rootScope.gVariable.srchTenantId = okData.TenantId;
        $rootScope.gVariable.srchTenantName = okData.TenantNm;
        $rootScope.$broadcast('broadcastSetChangeTenantID', okData);
      }, function(cancelData) {});
    };

    vm.eraseTenant = function() {
      vm.TENANTID = $window.sessionStorage['loginTenantId'];
      vm.TENANTNAME = $window.sessionStorage['loginTenantName'];
      $window.sessionStorage.setItem('srchTenantId', $window.sessionStorage['loginTenantId']);
      $window.sessionStorage.setItem('srchTenantName', $window.sessionStorage['loginTenantName']);
      $rootScope.gVariable.srchTenantId = $window.sessionStorage['loginTenantId'];
      $rootScope.gVariable.srchTenantName = $window.sessionStorage['loginTenantName'];
      $rootScope.$broadcast('broadcastSetChangeTenantID', {});
    };
    doCheckSession();

    function doLogin() {
      vm.appName = MAIN.APP_NAME;
      $log.info("account::", vm.loginInfo.account);
      $log.info("secureCode::", vm.loginInfo.secureCode);
      $state.go("main.dashboard");
    }

    function isLogin() {}

    function doLogout() {}

    function doCheckSession() {
      var prms = loginApi.doCheckSession().post({}).$promise;

      prms.then(function(json) {
        if (json != null && json.responseVO != null && json.responseVO.header.status == CONSTANT.HttpStatus.OK && json.responseVO.body.docs != null && json.responseVO.body.docs != '') {
          //console.log('Login user')
          $rootScope.setUserSession(json.responseVO.body.docs[0]);

          Auth.init(json.responseVO.body.docs[0].permissions);

          vm.userNm = $window.sessionStorage['loginUserName'];
          vm.userGbn = $window.sessionStorage['loginUserGbn'];
          vm.userTerm = $window.sessionStorage['loginUserTerm'];

        } else {
          StaticVariable.sessionExpire();
          $state.go('login');
        }
        // gAlert("로그아웃 되었습니다.");
      }, function(error) {
        console.error('fail', status);
      });
    }
  }
  /**
   * @ngdoc directive
   * @name izzyposWebApp.directive:adminPosHeader
   * @description
   * # adminPosHeader
   */
  var header = {
    transclude: true,
    controller: HeaderController,
    bindings: {},
    controllerAs: "header",
    templateUrl: 'components/ui-component/layout/header/header.html'
  };

  webapp.component("header", header);
})();

