(function() {
  "use strict";

  webapp.config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.main', {
      url : '/main',
      templateUrl : 'app/main/main.html'
    });
  }
})();
