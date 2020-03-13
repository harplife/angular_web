(function() {
  "use strict";
  branchAppsController.$inject = ['$state', '$cookies', '$rootScope', '$window', '$stateParams'];

  /** @ngInject */
  function branchAppsController($state, $cookies, $rootScope, $window, $stateParams) {
    var vm = this;

    if($stateParams.targetApp == "leaders" || $stateParams.targetApp == "members") {
      $window.sessionStorage['USE_APPTYPE'] = $stateParams.targetApp;
      $rootScope.USE_APPTYPE = $stateParams.targetApp;
      $state.go('m.dashboard');
    }
  }

  webapp.component("branchApps", {
    transclude: true,
    bindings: {},
    controller: branchAppsController
  });
})();
