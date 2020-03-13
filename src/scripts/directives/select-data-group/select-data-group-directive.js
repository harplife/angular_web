webapp.directive('selectDataGroup', [ '$compile', '$parse', function($compile, $parse) {
  return {
    transclude : true,
    restrict : 'E',
    scope : {
      codeChanged : "=",
    },
    templateUrl : 'scripts/directives/select-data-group/select-data-group.html',
    controller : 'SelectDataGroupCtrl as ccCtrl',
    link : function(scope, element, attrs, ctrl) {
      ctrl.codeChanged = scope.codeChanged;
    }
  };
} ]);
