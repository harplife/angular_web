webapp.directive('commonCode', [ '$compile', '$parse', function($compile, $parse) {
  return {
    transclude : true,
    restrict : 'E',
    scope : {
      paramData : "=",
      callback : "=",
      isDisabled : "=",
      chooseMessage : "="
    },
    templateUrl : 'scripts/directives/common-code/common-code.html',
    controller : 'CommonCodeCtrl as ccCtrl',
    link : function(scope, element, attrs, ctrl) {
      ctrl.callback = scope.callback;

      scope.$watchCollection('paramData', function(value) {
        //console.log('watchCollection paramData=', value);
        ctrl.paramData = scope.paramData;
        ctrl.getSelectList();
      });

      scope.$watchCollection('isDisabled', function(value) {
        //console.log('isDisabled=', scope.isDisabled);
        if (ctrl.isDisabled != undefined)
          ctrl.isDisabled = scope.isDisabled;
      });

      scope.$watchCollection('chooseMessage', function(value) {
        if (scope.chooseMessage != undefined)
          ctrl.chooseMessage = scope.chooseMessage;
      });
    }
  };
} ]);
