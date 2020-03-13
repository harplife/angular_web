(function () {
  'use strict';

  angular
    .module('salevis4-web')
    .config(toastrConfig)
    .config(translateConfig);

  /** @ngInject */
  function toastrConfig($logProvider, toastrConfig) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
  }

  /** @ngInject */
  function translateConfig($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider.useStaticFilesLoader({
      prefix: '/assets/i18n/lang-',
      suffix: '.data'
    });
    $translateProvider.preferredLanguage('ko');
  }
   /** @ngInject */
  function formlyConfig(formlyConfigProvider) {
    // Replace formlyBootstrap bootstrapLabel wrapper to implement horizontal forms
    formlyConfigProvider.removeWrapperByName('bootstrapLabel');
    formlyConfigProvider.setWrapper({
      name : 'bootstrapLabel',
      templateUrl : 'label-wrapper.html'
    });
  }

})();
