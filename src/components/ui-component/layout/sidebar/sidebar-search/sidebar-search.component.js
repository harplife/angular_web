(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name izzyposWebApp.directive:adminPosHeader
     * @description
     * # adminPosHeader
     */

    angular.module('salevis4-web')
        .component('sidebarSearch', {
            templateUrl: 'components/ui-component/layout/sidebar/sidebar-search/sidebar-search.html',
            controller: function ($scope) {
                $scope.selectedMenu = 'home';
            }
        });
})();
