(function() {
  "use strict";

  webapp.config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.basic', {
      url : '/basic',
      template : '<div ui-view></div>'
    }).state('app.basic.mng-calendar', {
      url: '/mng-calendar/:srch',
      templateUrl: 'app/basic/mng-calendar.html',
      requiresAuthentication: true,
    });
  }
})();
