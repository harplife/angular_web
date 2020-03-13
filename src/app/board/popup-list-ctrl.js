(function() {
  "use strict";
/**
 * @ngdoc function
 * @name app.bbspost:popup-list-ctrl
 * @description
 * # 게시판 목록
 * Controller of the 사용자정의 컬럼 게시판
 */
webapp.controller('PopupListCtrl', [ '$window', '$scope', '$location', '$state', '$stateParams', '$rootScope', 'GLOBAL_CONSTANT', 'postApi', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', 'modalFactory',
  /**
   * 게시판 - 목록화면 Control
   * @param {object} $window - window object
   * @param {object} $scope - scope object
   * @param {object} $location - location object
   * @param {object} $state -  state object
   * @param {object} $stateParams - state Parameter object
   * @param {object} CONSTANT - 전역 상수
   * @param {object} $rootScope - rootscope object
   * @param {object} H0102APISvr - H0102APISvr Module
   */
  function PopupListCtrl($window, $scope, $location, $state, $stateParams, $rootScope, CONSTANT, postApi,DTOptionsBuilder, DTColumnBuilder, $compile, modalFactory) {

    var vm = this;
    /* 사용자검색 */
    function openModalUser() {
      var ctrl = 'UserModalCtrl as modalCtrl';
      var paramData = { srchTenantId : $rootScope.gVariable.srchTenantId };

      var modalInstance = modalFactory.open('lg', 'components/modal/users/user-modal.html', ctrl, paramData);
      modalInstance.result.then(function(res) {
        vm.srch.UserNm = res.UserNm;
        vm.srch.UserId = res.UserId;
      }, function(cancelData) {
      });
    }
    /* 사용자검색- 지우기 */
    function clearUser() {
      vm.srch.UserNm = '';
      vm.srch.UserId = '';
    }

    vm.srch = {
      ZipCode : "",
      Addr1 : ""
    }

    /* 다음 주소검색 */
    function getAddressInfo(){
      new daum.Postcode({
        oncomplete: function(data) {
          vm.zipCode = data.zonecode;
          vm.addr1 = data.buildingName!= "" ? data.address+" "+data.buildingName : data.address ;
          $('#zipCode').val(vm.zipCode);
          $('#addr1').val(vm.addr1);
        },
      }).open();

    }

    /* 단품(제품)조회 */
    function openModalPrd() {
      var ctrl = 'ProductModalCtrl as modalCtrl';
      var paramData = { srchTenantId : $rootScope.gVariable.srchTenantId };

      var modalInstance = modalFactory.open('md', 'components/modal/product/product-modal.html', ctrl, paramData);
      modalInstance.result.then(function(res) {
        vm.srch.ProductNm = res.ProductNm;
        vm.srch.ProductId = res.ProductId;
      }, function(cancelData) {
      });
    }
    /* 단품(제품)조회- 지우기 */
    function clearPrd() {
      vm.srch.ProductId = '';
      vm.srch.ProductNm = '';
    }

    /* 관리권 검색 */
    vm.srch = {
      CareTktNm : '',
      CareTktId : ''
    }
    function openModalCareTkt() {
      var ctrl = 'CareTktModalCtrl as modalCtrl';
      var paramData = { srchTenantId : $rootScope.gVariable.srchTenantId };

      var modalInstance = modalFactory.open('md', 'components/modal/careTkt/care-tkt-modal.html', ctrl, paramData);
      modalInstance.result.then(function(res) {

        vm.srch.CareTktNm = res.CareTktNm;
        vm.srch.CareTktId = res.KeyId;

      }, function(cancelData) {
      });
    }
    /* 관리권검색- 지우기 */
    function clearCareTkt() {
      vm.srch.CareTktNm = '';
      vm.srch.CareTktId = '';
    }


    /* 고객검색 */
    function openModalCustomer() {
      var ctrl = 'CustomerModalCtrl as modalCtrl';
      var paramData = { srchTenantId : $rootScope.gVariable.srchTenantId };

      var modalInstance = modalFactory.open('lg', 'components/modal/customer/customer-modal.html', ctrl, paramData);
      modalInstance.result.then(function(res) {
        vm.srch.CustNm = res.CustNm;
        vm.srch.CustId = res.CustId;
      }, function(cancelData) {
      });
    }
    /* 고객검색- 지우기 */
    function clearCustomer() {
      vm.srch.CustNm = '';
      vm.srch.CustId = '';
    }

    // 함수 선언

    vm.clearPrd = clearPrd;
    vm.openModalPrd = openModalPrd;
    vm.openModalUser = openModalUser;
    vm.clearUser = clearUser;
    vm.getAddressInfo = getAddressInfo;
    vm.openModalCareTkt = openModalCareTkt;
    vm.clearCareTkt = clearCareTkt;
    vm.clearCustomer = clearCustomer;
    vm.openModalCustomer = openModalCustomer;
  },
]);
})();
