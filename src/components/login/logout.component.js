(function() {
  "use strict";
  LogoutController.$inject = ['$window', '$state', 'StaticVariable', 'LoginAPISrv', 'gAlert'];

  /** @ngInject */
  function LogoutController($window, $state, StaticVariable, loginApi, gAlert) {
    var vm = this;
    vm.user = {};
    vm.loginInfo = {};

    vm.doLogout = doLogout;

    function doLogout() {
      StaticVariable.sessionExpire();
      var prms = loginApi.doLogout().post().$promise;
      prms.then(function(json) {
        var temp = {};
        temp.layoutBoard = "N";
        $window.sessionStorage.clear();
        $window.sessionStorage["layoutBoard"] = temp.layoutBoard;
        gAlert('', 'Menu.SIGNEDOUT', {
          btn : '',
          fn : function() {
            //$window.location.replace('/' + CONSTANT.URL.CONTEXT);
            //$state.reload('main.login');
            $state.go('login');
          }
        });
      }, function(error) {
        console.error('fail', status);
      });
    }

    doLogout();

  }

  webapp.component("logout", {
    transclude: true,
    bindings: {},
    controller: LogoutController,
  });
})();
