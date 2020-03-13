(function () {
  "use strict";

  //var checkdTarget = window.location.href.split('//')[1].split("/")[1].replace("#","");
  var checkdTarget;
  var checkMobile = false;

  webapp.config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $windowProvider, $translateProvider) {
    var $window = $windowProvider.$get();

    $.ajax({
      url: 'https://ipapi.co/json/',
      async: false,
      success: function(data){
          var country = data.country;
          var lang = "en";
          if(country == "KR") lang = "ko";
          else if(country == "US") lang = "en";
          else if(country == "RU") lang = "ru";
          else if(country == "DE") lang = "de";
          $translateProvider.preferredLanguage(lang);
          $urlRouterProvider.otherwise('/' + lang + '/app/main');

          var dataInterval = setInterval(function() {

              if($('html').hasClass("ng-scope")) {
                  if($("#section--content").height() > 0) {
                      $('html').removeClass('cloak');
                      clearInterval(dataInterval);
                  }
              }
          }, 10);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          $urlRouterProvider.otherwise('/en/app/main');

          var dataInterval = setInterval(function() {

              if($('html').hasClass("ng-scope")) {
                  if($("#section--content").height() > 0) {
                      $('html').removeClass('cloak');
                      clearInterval(dataInterval);
                  }
              }
          }, 10);
      }
    });

    $stateProvider
      .state("app",     { url: "/:lang/app",component: "app"});
  }

})();
