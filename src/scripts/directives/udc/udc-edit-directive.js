webapp.directive('udcEdit', [ '$compile', '$parse', function($compile, $parse) {
  return {
    transclude : true,
    restrict : 'E',
    scope : {
      metaList : "=",
      metaModel : "=",
    },
    templateUrl : 'scripts/directives/udc/udc-edit.html',
    controller : 'UdcEditCtrl as vc',
    link : function(scope, element, attrs, ctrl) {
      scope.$watchCollection('metaList', function(value) {
        ctrl.metaList = scope.metaList;
        ctrl.metaModel = scope.metaModel;
        ctrl.initalized = true;
      });

      ctrl.initChangeData = function(val) {
        try {
          if(attrs.metaModel != undefined) {
//            scope.metaModel = val;
          }
        } catch (e) {}
      };
    }
  };
} ]);
