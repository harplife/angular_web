webapp.directive('searchCondition', [ '$compile', '$parse', function($compile, $parse) {
  return {
    transclude : true,
    restrict : 'E',
    scope : {
      count : "=",
      columnMap : "=",
      srch : "="
    },
    templateUrl : 'scripts/directives/search-condition/search-condition.html',
    controller : 'SearchConditionCtrl as ccCtrl',
    link : function(scope, element, attrs, ctrl) {
      scope.$watchCollection('count', function(value) {
        ctrl.count = scope.count;
      });

      scope.$watchCollection('columnMap', function(value) {
        ctrl.columnMap = scope.columnMap;
      });

      scope.$watchCollection('srch', function(value) {
        //console.log('watchCollection paramData=', value);
        ctrl.srch = scope.srch;
        ctrl.updateSearchCoditionStr();
      });
    }
  };
} ]);
