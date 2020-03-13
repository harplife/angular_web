(function() {
  "use strict";

  webapp.config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.bbspost', {
      url : '/bbspost',
      template : '<div ui-view></div>',
    }).state('app.bbspost.h0101-list', {
      url : '/h0101-list/:BoardId',
      templateUrl : 'app/board/h0101-list.html',
        resolve : {
         plugins : [ '$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            '/assets/app/vendor/footable/js/footable.js',
            '/assets/app/vendor/footable/css/footable.min.css',
          ]);
        }],
      },
    }).state('app.bbspost.h0101-detail', {
      url : '/h0101-detail/:BoardId/:FreeBoardId',
      templateUrl : 'app/board/h0101-detail.html',
    }).state('app.bbspost.h0101-edit', {
      url : '/h0101-edit/:BoardId/:FreeBoardId',
      templateUrl : 'app/board/h0101-edit.html',
    }).state('app.bbspost.h0102-list', {
      url : '/h0102-list/:srch/:BbsMasterId',
      templateUrl : 'app/board/h0102-list.html',
        resolve : {
         plugins : [ '$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            '/assets/app/vendor/footable/js/footable.js',
            '/assets/app/vendor/footable/css/footable.bootstrap.min.css',
            ]);
        } ],
      }
    }).state('app.bbspost.h0102-edit', {
      url : '/h0102-edit/:srch/:BbsPostId/:BbsMasterId',
      templateUrl : 'app/board/h0102-edit.html',
    }).state('app.bbspost.h0102-detail', {
      url : '/h0102-detail/:srch/:BbsPostId/:BbsMasterId',
      templateUrl : 'app/board/h0102-detail.html',
    }).state('app.bbspost.h0102-list.detail', {
      url : '/detail/:BbsPostId',
      templateUrl : 'app/board/h0102-detail.html',
    }).state('app.bbspost.h0102-list.edit', {
      url : '/edit/:BbsPostId',
      templateUrl : 'app/board/h0102-edit.html',
    }).state('app.bbspost.bbs-master-list', {
      url : '/bbs-master-list/:srch',
      templateUrl : 'app/board/bbs-master-list.html',
        resolve : {
         plugins : [ '$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            '/assets/app/vendor/footable/js/footable.js',
            '/assets/app/vendor/footable/css/footable.bootstrap.min.css',
            ]);
        } ],
      }
    }).state('app.bbspost.bbs-master-edit', {
      url : '/bbs-master-edit/:srch/:BbsMasterId',
      templateUrl : 'app/board/bbs-master-edit.html',
    }).state('app.bbspost.bbs-master-detail', {
      url : '/bbs-master-detail/:srch/:BbsMasterId',
      templateUrl : 'app/board/bbs-master-detail.html',
    }).state('app.bbspost.bbs-master-list.detail', {
      url : '/detail/:BbsMasterId',
      templateUrl : 'app/board/bbs-master-detail.html',
    }).state('app.bbspost.bbs-master-list.edit', {
      url : '/edit/:BbsMasterId',
      templateUrl : 'app/board/bbs-master-edit.html',
    })

    .state('app.bbspost.splitter', {
      url : '/splitter',
      templateUrl : 'app/board/splitter.html',
    })

    /* S : 고객상담관리/고객관리>고객등록 */
    .state('app.bbspost.h0103-list', {
      url : '/h0103-list/:srch',
      templateUrl : 'app/board/h0103-list.html',
        resolve : {
         plugins : [ '$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            '/assets/app/vendor/footable/js/footable.js',
            '/assets/app/vendor/footable/css/footable.bootstrap.min.css',
            ]);
        } ],
      }
    }).state('app.bbspost.h0103-edit', {
      url : '/h0103-edit/:srch/:BbsPostId',
      templateUrl : 'app/board/h0103-edit.html',
    }).state('app.bbspost.h0103-detail', {
      url : '/h0103-detail/:srch/:BbsPostId',
      templateUrl : 'app/board/h0103-detail.html',
    }).state('app.bbspost.h0103-list.detail', {
      url : '/detail/:BbsPostId',
      templateUrl : 'app/board/h0103-detail.html',
    }).state('app.bbspost.h0103-list.edit', {
      url : '/edit/:BbsPostId',
      templateUrl : 'app/board/h0103-edit.html',
    })
    /* E : 고객상담관리/고객관리>고객등록 */
    /* 모달팝업 목록 */
    .state('app.bbspost.popup-list', {
      url : '/popup-list/:srch',
      templateUrl : 'app/board/popup-list.html',
        resolve : {
         plugins : [ '$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            '/assets/app/vendor/footable/js/footable.js',
            '/assets/app/vendor/footable/css/footable.bootstrap.min.css',
            ]);
        } ],
      }
    })
  }
})();
