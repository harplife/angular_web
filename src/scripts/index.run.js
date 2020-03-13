(function() {
  "use strict";

  webapp.run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $translate, $transitions, $http, $timeout) {
    // $http.defaults.withCredentials = true;
    $http.defaults.headers.common["Content-Type"] =
      "application/json; charset=utf-8";
    $http.defaults.headers.common.Accept = "application/json, text/html";

    $transitions.onStart({}, onStart);
    $transitions.onSuccess({}, onSuccess);

    /** @ngInject */
    function onStart(trans) {
      var $state = trans.router.stateService;
      //$log.info("[onStart name]::", $state.current.name);
      $rootScope.dataloader = true;
      //console.log('onStart');
    }

    /** @ngInject */
    function onSuccess(trans) {
      var $state = trans.router.stateService;
      $state.getCurrentPath().forEach(function(element) {
       // $log.info("[onSuccess name]::", element.state.name);
      });

      if($("body").attr("nav-state") == undefined) {
        if( !$("html").hasClass("isOnlyDevice") )
        initPageNavState();
      }

      $timeout(function(){
        initViewLoadedInputBoxStyle();
        initPageContentMinHeight();
        initLabelTitle();
      });

      setTimeout(function() {
        $rootScope.dataloader = false;
        $rootScope.title = $translate.instant('PRODUCT.TITLE');
      }, 200);

      //console.log('onStop');
    }
  }

  function initPageNavState() {
    var winWidth = $(window).width();
    if (winWidth < 560) $("body").attr("nav-state", "xs-off");
    else if (winWidth < 768) $("body").attr("nav-state", "sm-off");
    else if (winWidth > 767 ) {
      var localStorage = window.localStorage;
      var navState = localStorage.getItem("navMenuMdSizeState");

      if(navState == null || navState == undefined || navState == "on" || navState == "off") {
        navState = "l";
        localStorage.setItem('navMenuMdSizeState', navState);
      }
      $("body").attr("nav-state", "md-" + navState);
    }
    //setToggleImage();
  }
})();
// ui-router login example
// $transitions.onStart( { to: 'auth.**' }, function(trans) {
//     var $state = trans.router.stateService;
//     var MyAuthService = trans.injector().get('MyAuthService');
//     // If the user is not authenticated
//     if (!MyAuthService.isAuthenticated()) {
//       // Then return a promise for a successful login.
//       // The transition will wait for this promise to settle
//       return MyAuthService.authenticate().catch(function() {
//         // If the authenticate() method failed for whatever reason,
//         // redirect to a 'guest' state which doesn't require auth.
//         return $state.target("guest");
//       });
//     }
//   });
