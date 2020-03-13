(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name izzyposWebApp.directive:adminPosHeader
     * @description
     * # adminPosHeader
     */

    TimeLine.$inject = ['$log'];

    /** @ngInject */
    function TimeLine($log) {
        $log.info('TimeLine Controller');
    }

    angular.module('salevis4-web')
        .component('timeline', {
            templateUrl: 'components/ui-component/timeline/timeline.html',
            controller: TimeLine
        });

})();
