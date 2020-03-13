webapp.directive('commonCodeTree', [ '$compile', '$parse', '$timeout', function($compile, $parse, $timeout) {
  return {
    transclude : true,
    restrict : 'E',
    scope : {
      codeType : "=",
      codeList : "=",
      codeModel : "=",
      reloadSeq : "=",
      codeChanged : "=",
      chooseMessage : "=",
      preventChanging : "="
    },
    templateUrl : 'scripts/directives/common-code-tree/common-code-tree.html',
    controller : 'CommonCodeTreeCtrl as ccCtrl',
    link : function(scope, element, attrs, ctrl) {
      // scope.$watchCollection('codeType', function(value) {
      //   ctrl.codeModel = scope.codeModel;
      //   ctrl.getSelectList(scope.codeType);
      // });
      ctrl.codeModel = scope.codeModel;
      ctrl.codeChanged = scope.codeChanged;

      scope.$watchCollection('codeList', function(value) {
        //console.log('watchCollection paramData=', value);
        ctrl.codeModel = scope.codeModel;
        ctrl.setSelectList(scope.codeList);
      });

      scope.$watchCollection('reloadSeq', function(value) {
        console.log('scope.reloadSeq=[', scope.reloadSeq, ']');
        if (scope.reloadSeq == undefined) {
          ctrl.getSelectList(scope.codeType);
        }
      });

      /** CommonCode Controller **/
      ctrl.initChangeData = function(code, bLast) {
        try {
          if (attrs.codeModel != undefined) {
            scope.codeModel = code;
          }

          if (attrs.codeChanged != undefined) {
            if (!scope.preventChanging || bLast) {
              $timeout(function() {
                return scope.codeChanged(code);
              }, 1);
            }
          }
        } catch (e) {}
      };
    }
  };
} ]);
