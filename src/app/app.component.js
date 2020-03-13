(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name izzyposWebApp.directive:adminPosHeader
     * @description
     * # adminPosHeader
     */

    /** @ngInject */
    var AppController = function ($log, $window, $stateParams, $translate, $rootScope) {
        var vm = this;
        vm.awesomeThings = [];
        vm.classAnimation = '';
        vm.creationDate = 1532423437610;
        //$log.log(vm.creationDate);

        var lang = $stateParams.lang != null ? $stateParams.lang : 'ko';
        console.log(lang);
        $translate.use(lang);
        $rootScope.currentLanguage = lang;
        $window.sessionStorage['currentLanguage'] = lang;
    };

    var app = {
        templateUrl: 'app/app.html',
        controller: AppController
    };

    webapp.component('app', app);
})();
