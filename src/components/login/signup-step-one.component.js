(function() {
  "use strict";
  SignupStepOneController.$inject = ['$scope', '$log', '$state', '$filter', '$cookies', '$rootScope', 'MAIN', 'LoginAPISrv', 'GLOBAL_CONSTANT', 'gAlert', '$window', '$translate', '$stateParams','modalFactory'];

  /** @ngInject */
  function SignupStepOneController($scope, $log, $state, $filter, $cookies, $rootScope, MAIN, loginApi, CONSTANT, gAlert, $window, $translate, $stateParams,modalFactory) {
    var vm = this;

    vm.signupStepTwo = signupStepTwo;
    vm.salemeetSignupStepTwo = salemeetSignupStepTwo;

    vm.tenantId = '';
    vm.tenantNm = '';
    vm.goCancel = goCancel;
    vm.salemeetGoCancel = salemeetGoCancel;

    vm.srchTenantModal = function() {
      var ctrl = 'TenantModalCtrl as vc';
      var paramData = {tenantId:''};
      var modalInstance = modalFactory.open('modal', 'components/modal/tenant/tenant-modal.html', ctrl, paramData);
      modalInstance.result.then(function(okData) {
        vm.tenantId = okData.TenantId;
        vm.tenantNm = okData.TenantNm;
      }, function(cancelData) {});
    };

    vm.eraseTenant = function() {
      vm.tenantId = '';
      vm.tenantNm = '';
    };

    function signupStepTwo(){
      if (vm.tenantId == '' || vm.tenantId == null || vm.tenantId == undefined ||
       vm.tenantNm == '' || vm.tenantNm == null || vm.tenantNm == undefined ) {
        gAlert('','회원사를 선택해주세요');
      } else {
        $state.go('signup2', {
          tenantId: vm.tenantId
        });
      }
    }

    function salemeetSignupStepTwo(){
      if (vm.tenantId == '' || vm.tenantId == null || vm.tenantId == undefined) {
        gAlert('','회원사코드를 입력해주세요');
      } else {
        $state.go('salemeetsignup2', {
          tenantId: vm.tenantId
        });
      }
    }

    function goCancel() {
      $state.go("login");
    }

    function salemeetGoCancel() {
      $state.go("salemeet");
    }
  }

  webapp.component("signupStepOne", {
    transclude: true,
    bindings: {},
    controller: SignupStepOneController,
    controllerAs: "vc",
    templateUrl: "components/login/signup-step-one.html"
  });

  webapp.component("salemeetSignupStepOne", {
    transclude: true,
    bindings: {},
    controller: SignupStepOneController,
    controllerAs: "vc",
    templateUrl: "components/login/salemeet-signup-step-one.html"
  });
})();
