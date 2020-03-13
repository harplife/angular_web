webapp.directive('commonCodeCustom', [ '$compile', '$parse', function($compile, $parse) {
  return {
    transclude : true,
    restrict : 'E',
    scope : {
      codeList : "=",
      codeModel : "=",
      callback : "=",
      isDisabled : "=",
    },
    templateUrl : 'scripts/directives/common-code-custom/common-code-custom.html',
    controller : 'CommonCodeCustomCtrl as ccCtrl',
    link : function(scope, element, attrs, ctrl) {
      ctrl.callback = scope.callback;
      ctrl.isDisabled = scope.isDisabled;
      scope.$watchCollection('codeList', function(value) {
        //console.log('watchCollection paramData=', value);
        ctrl.codeModel = scope.codeModel;
        ctrl.getSelectList(scope.codeList);
      });

      scope.$watchCollection('codeModel', function(value) {
        //console.log('watchCollection paramData=', value);
        ctrl.codeModel = scope.codeModel;
        ctrl.onChangeHandler();
      });

      /** CommonCode Controller **/
      ctrl.initChangeData = function(val) {
        console.log(val);
        try {
          if(attrs.codeModel != undefined) {
            scope.codeModel = val;
          }
        } catch (e) {}
      };
    }
  };
} ]);
