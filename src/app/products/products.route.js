(function() {
  "use strict";

  webapp.config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.products', {
      url : '/products',
      template : '<div ui-view></div>'
    }).state('app.products.products', {
      url : '/products',
      templateUrl : 'app/products/products.html'
    }).state('app.products.products-page1', {
      url : '/products-page1',
      templateUrl : 'app/products/products-page1.html'
    }).state('app.products.products-page2', {
      url : '/products-page2',
      templateUrl : 'app/products/products-page2.html'
    });
  }
})();
