(function () {
    'use strict';

    HeaderNotificationController.$inject = ['$log','$window','LoginAPISrv','StaticVariable','GLOBAL_CONSTANT', 'gAlert', '$state', 'modalFactory', '$rootScope'];
    /** @ngInject */
    function HeaderNotificationController($log,$window,loginApi,StaticVariable,CONSTANT,gAlert, $state, modalFactory, $rootScope) {
      var vm = this;
      vm.user = {UserName:$rootScope.gVariable.UserName};
      vm.doLogout = doLogout;
      vm.myPage = myPage;
      vm.checkUse = false;

      function doLogout() {
        StaticVariable.sessionExpire();
        var prms = loginApi.doLogout().post().$promise;
        prms.then(function(json) {
          var temp = {};
          temp.layoutBoard = "N";
          $window.sessionStorage.clear();
          $window.sessionStorage["layoutBoard"] = temp.layoutBoard;
          gAlert('', 'Menu.SIGNEDOUT', {
            btn : '',
            fn : function() {
              //$window.location.replace('/' + CONSTANT.URL.CONTEXT);
              //$state.reload('main.login');
              $state.go('login');
            }
          });
        }, function(error) {
          console.error('fail', status);
        });
      }

      /**
       * 내정보 수정 팝업 호출
       *
       */
      function myPage() {
        var ctrl = 'MyPageModalCtrl as modalCtrl';
        var paramData = {UserId : $rootScope.gVariable.UserId, TenantId: $window.sessionStorage["loginTenantId"]};
        var modalInstance = modalFactory.open("lg", "components/modal/mypage/mypage-modal.html", ctrl, paramData);
        modalInstance.result.then(
          function (okData) {
            //성공
          },
          function (cancelData) {
            // 취소
          }
        );
      }
    } // End Controller

    var header = {
      transclude: true,
      controller: HeaderNotificationController,
      bindings: {},
      controllerAs: "vc",
      templateUrl: 'components/ui-component/layout/header/header-notification/header-notification.html'
    };

    webapp.component("headerNotification", header);

})();
