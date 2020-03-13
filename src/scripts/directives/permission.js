'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:activateButton
 * @description
 * # activateButton
 */
webapp.directive('permission', [ 'Auth', function(Auth) {
  return {
    restrict : 'A',
    scope : {
      permission : '=',
    },

    link : function(scope, elem, attrs) {
      scope.$watch(attrs.ngShow, function() {
        /* console.log('scope.permission=', scope.permission); */
        if (Auth.userHasPermission(scope.permission)) {
          elem.show();
        } else {
          elem.hide();
        }
      });
    }
  }
} ]);
