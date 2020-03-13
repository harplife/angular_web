webapp.factory('gConfirm', [ '$filter', 'modalFactory', function($filter, modalFactory) {
  var defaultIconClazz = 'noty';
  var templateUrl = 'components/ui-component/factory/gconfirm-factory.html';

  var basicConfirm = function(p1, p2, p3, p4, p5) {

    //title, msg, okAct, closeAct, options
    /*
      if p2 ? string : p1 = "type", p2 = msg, p3 = ok, p4 = cancel;
      else p1 = msg, p2 = ok, p3 = cancel

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
    var defaultCloseBtn = translate('Menu.CANCEL');
    var defaultOkBtn = translate('Menu.OK');

    var modalInstance = modalFactory.open('sm', templateUrl, function($uibModalInstance, $scope, $document) {

      var msg = (mode) ? p2 : p1;

      $scope.alertColor = color;
      $scope.alertIco = ico;
      $scope.alertMessage = translate(msg);

      var okAct, closeAct;
      if(mode) {
        okAct = p3; closeAct = p4;
        $scope.okBtn = okAct && okAct.btn ? translate(okAct.btn) : defaultOkBtn;
        $scope.closeBtn = closeAct && closeAct.btn ? translate(closeAct.btn) : defaultCloseBtn;
        $scope.iconClazz = p5 && p5.type ? p5.type : defaultIconClazz;
      } else {
        okAct = p2; closeAct = p3;
        $scope.okBtn = okAct && okAct.btn ? translate(okAct.btn) : defaultOkBtn;
        $scope.closeBtn = closeAct && closeAct.btn ? translate(closeAct.btn) : defaultCloseBtn;
        $scope.iconClazz = p4 && p4.type ? p4.type : defaultIconClazz;
      }

      var okFn = okAct && okAct.fn ? okAct.fn : null;
      var closeFn = closeAct && closeAct.fn ? closeAct.fn : null;

      $scope.onClose = function() {
        if (closeFn)
          closeFn();
        $uibModalInstance.dismiss('cancel');
      };
      $scope.onOk = function() {
        if (okFn)
          okFn();
        $uibModalInstance.dismiss('cancel');
      };

      var EVENT_TYPES = 'keydown keypress';
      function eventHandler(event) {
        var _key = event.which; // enter, space
        if ((_key === 13 || _key === 32) && event.target.className.indexOf('modal') > -1) {
          event.preventDefault();
          $scope.onOk();
        }

      }
      $document.on(EVENT_TYPES, eventHandler);
      $scope.$on('$destroy', function() {
        $document.off(EVENT_TYPES, eventHandler);
      });
    }, {}, {
      keyboard : true
    });
  }

  return basicConfirm;
} ]);
