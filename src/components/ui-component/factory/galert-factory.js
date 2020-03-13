(function() {
  "use strict";
  webapp.factory('gAlert',
    [ '$filter', '$rootScope', 'modalFactory',
    function($filter, $rootScope, modalFactory) {

      var templateUrl = 'components/ui-component/factory/galert-factory.html';

      return function(p1, p2, p3, p4) {

        /*
          if p2 ? string : p1 = "type", p2 = msg, p3 = function
          else p1 = msg, p2 = function

          Alert Type : info, error
          p1 type of String : alert type
          p1 type of Function : ok function / default Info
        */

        var ico = "", color = "", mode = true;
        if(typeof(p2) == "string") {
          if(p1.toLowerCase() == "i") {
            ico = "alert-icon-exclamation";
            color = "0066cc";
          } else if(p1.toLowerCase() == "c") {
           ico = "alert-icon-check";
           color = "0066cc";
          } else if(p1.toLowerCase() == "w") {
            ico = "alert-icon-caution";
            color = "be1a16";
          } else {
            ico = "alert-icon-exclamation";
            color = "0066cc";
          }
        } else {
          mode = false;
          ico = "alert-icon-exclamation";
          color = "0066cc";
        }

        var translate = $filter('translate');
        var defaultCloseBtn = translate('Menu.CONFIRM');
        if(mode) {
          if ($rootScope.gVariable.alertMessage == p2 || p2 == null)
            return;
        } else {
          if ($rootScope.gVariable.alertMessage == p1 || p1 == null)
            return;
        }


        var modalInstance = modalFactory.open('sm', templateUrl, function($uibModalInstance, $scope, $document) {
          //$scope.title = (title == '') ? translate('Menu.ALERT') : translate(title);

          var msg = (mode) ? p2 : p1;
          $rootScope.gVariable.alertMessage = msg;
          $scope.alertColor = color;
          $scope.alertMessage = translate(msg);
          $scope.alertIco = ico;

          var okAct;
          if(mode) {
            $scope.closeBtn = p3 && p3.btn ? translate(p3.btn) : defaultCloseBtn;
            okAct = p3;
          } else {
            $scope.closeBtn = p2 && p2.btn ? translate(p2.btn) : defaultCloseBtn;
            okAct = p2;
          }

          var okFn = okAct && okAct.fn ? okAct.fn : null;
          $scope.onClose = function() {
            if (okFn)
              okFn();
            $uibModalInstance.dismiss('cancel');
            $rootScope.gVariable.alertMessage = '';
          };

          var EVENT_TYPES = 'keydown keypress';
          function eventHandler(event) {
            var _key = event.which; // enter, space
            if ((_key === 13 || _key === 32) && event.target.className.indexOf('modal') > -1) {
              event.preventDefault();
              $scope.onClose();
            }
          }
          $document.on(EVENT_TYPES, eventHandler);
          $scope.$on('$destroy', function() {
            $document.off(EVENT_TYPES, eventHandler);
          });
        }, {}, {
          keyboard : true
        });
      };
    }]);
})();
