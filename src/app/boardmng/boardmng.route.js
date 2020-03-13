(function() {
  "use strict";

  webapp.config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.boardmng', {
      url: '/boardmng',
      template: '<div ui-view></div>',
    }).state('app.boardmng.list', {
      url: '/list/:srch',
      templateUrl: 'app/boardmng/boardmng-list.html',
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            '/assets/app/vendor/footable/js/footable.js',
            '/assets/app/vendor/footable/css/footable.bootstrap.min.css',
          ]);
        }],
      },
    }).state('app.boardmng.list.add', {
      templateUrl: 'app/boardmng/boardmng-edit.html',
      controller: 'BoardMngEditCtrl as boardMngSave',
      params:{
        currentActionView: 'add'
      },
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            '/assets/app/vendor/footable/js/footable.js',
            '/assets/app/vendor/footable/css/footable.bootstrap.min.css',
          ]);
        }],
      },
    }).state('app.boardmng.list.modify', {
      url: '/modify/:tableNm',
      templateUrl: 'app/boardmng/boardmng-edit.html',
      controller: 'BoardMngEditCtrl as boardMngSave',
      params:{
        currentActionView: 'modify'
      },
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            '/assets/app/vendor/footable/js/footable.js',
            '/assets/app/vendor/footable/css/footable.bootstrap.min.css',
          ]);
        }],
      },
    }).state('app.boardmng.add', {
      url: '/add/:srch',
      templateUrl: 'app/boardmng/boardmng-edit.html',
      controller: 'BoardMngEditCtrl as boardMngSave',
      params:{
        currentActionView: 'add'
      },
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            '/assets/app/vendor/footable/js/footable.js',
            '/assets/app/vendor/footable/css/footable.bootstrap.min.css',
          ]);
        }],
      },
    }).state('app.boardmng.modify', {
      url: '/modify/:srch/:tableNm',
      templateUrl: 'app/boardmng/boardmng-edit.html',
      controller: 'BoardMngEditCtrl as boardMngSave',
      params:{
        currentActionView: 'modify'
      },
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            '/assets/app/vendor/footable/js/footable.js',
            '/assets/app/vendor/footable/css/footable.bootstrap.min.css',
          ]);
        }],
      },
    });
  }
})();
