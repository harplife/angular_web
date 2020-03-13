/* "use strict"; */
angular.module("ngModules", [
  "ngCookies",
  "ngSanitize",
  "ngMessages",
  "ngResource",
  "ngAnimate"
]);
angular.module("ui.bootstap.fam", ["ui.bootstrap", "ui.bootstrap.position"]);
angular.module("salevis4", [
  "ngTouch",
  "picardy.fontawesome",
  "angular-loading-bar",
  "angular-momentjs",
  "monospaced.qrcode",
  "FBAngular",
  "angularBootstrapNavTree",
  "oc.lazyLoad",
  "ui.select",
  "ui.tree",
  /* "textAngular", */
  "colorpicker.module",
  "angularFileUpload",
  "ngImgCrop",
/*   "datatables",
  "datatables.bootstrap",
  "datatables.colreorder",
  "datatables.colvis",
  "datatables.tabletools",
  "datatables.scroller",
  "datatables.columnfilter", */
  "ui.grid",
  "ui.grid.resizeColumns",
  "ui.grid.edit",
  "ui.grid.moveColumns",
  /* "ngTable", */
  /* "smart-table", */
  "angular-flot",
  /* "angular-rickshaw", */
  "easypiechart",
/*   "uiGmapgoogle-maps", */
  "ui.calendar",
  "ngTagsInput",
  "ngMaterial",
  "localytics.directives",
  "leaflet-directive",
/*   "wu.masonry", */
  "ipsum",
  "angular-intro",
  "dragularModule"
]);
angular.module("utils", [
  "ui.router",
  "ui.router.state.events",
  "toastr",
  "pascalprecht.translate",
  "ui.utils"
]);

var webapp = angular.module("salevis4-web", [
  "ngModules",
  "ui.bootstap.fam",
  "salevis4",
  "utils",
  "AuthServices",
  "as.sortable",
  "fa.directive.borderLayout"
]);

webapp
  .run([
    "$rootScope",
    "$state",
    "$stateParams",
    "$window",
    "$translate",
    "$http",
    "$transitions",
    "Auth",
    "$filter",
    "GLOBAL_CONSTANT",
    function($rootScope, $state, $stateParams, $window, $translate, $http, $transitions, Auth, $filter, CONSTANT) {
      $rootScope.gVariable = {
        alertMessage : '',
        DeviceId : $window.sessionStorage['DeviceId'],
        DeviceNm : $window.sessionStorage['DeviceNm'],
        SysAdminYN : $window.sessionStorage['SysAdminYN'],
      }
      $rootScope.changeLanguage = function (langKey) {
        $translate.use(langKey);
        $rootScope.currentLanguage = langKey;
        $window.sessionStorage['currentLanguage'] = langKey;
      };

      $rootScope.currentLanguage = $translate.proposedLanguage() || $translate.use() || $window.sessionStorage['currentLanguage'];
      $rootScope.APIDOMAIN = CONSTANT.URL.HTTP_PROTOCOL + '//' + CONSTANT.URL.API_SERVER_DOMAIN + ':' + CONSTANT.URL.PORT;

  /*    $http.get('/meta/meta.data').success( function(data){
          $rootScope.meta = data;
          watchUrl();
      });*

      function watchUrl() {
        $rootScope.$watch(function() {
          return $location.path();
        },
        function(a){
          var url = a.replace(/[/-]/gi,'_')
          if($rootScope.meta[''+$rootScope.currentLanguage+''][''+url+''] != undefined) {
              $rootScope.metaTitle = $rootScope.meta[''+$rootScope.currentLanguage+''][''+url+'']['TITLE'];
              $rootScope.metaDescription = $rootScope.meta[''+$rootScope.currentLanguage+''][''+url+'']['DESCRIPTION'];
              $rootScope.metaKeywords = $rootScope.meta[''+$rootScope.currentLanguage+''][''+url+'']['KEYWORDS'];
          } else {
              $rootScope.metaTitle = "Point Mobile";
              $rootScope.metaDescription = "Point Mobile is one of the leading AIDC hardware suppliers offering a full range of rugged mobile computers and handheld terminals.";
              $rootScope.metaKeywords = "";
          }
        });
      }*/
    }
  ])

  .config(
  [ '$translateProvider', function($translateProvider) {
      $translateProvider.useStaticFilesLoader({
        prefix : 'languages/',
        suffix : '.data'
      });
    }
  ]);
