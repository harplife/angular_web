/* import { chmod } from "fs"; */
/**
 * @ngdoc function
 * @name app.main:main-ctrl
 * @description
 * # 게시판 목록
 * Controller of the 사용자정의 컬럼 게시판
 */
webapp.controller('MainCtrl', [ '$window', '$scope', '$location', '$state', '$stateParams', '$rootScope', 'GLOBAL_CONSTANT', 'postApi', '$compile', 'modalFactory', '$translate', '$filter',
  /**
   * 게시판 - 목록화면 Control
   * @param {object} $window - window object
   * @param {object} $scope - scope object
   * @param {object} $location - location object
   * @param {object} $state -  state object
   * @param {object} $stateParams - state Parameter object
   * @param {object} CONSTANT - 전역 상수
   * @param {object} $rootScope - rootscope object
   */
  function MainCtrl($window, $scope, $location, $state, $stateParams, $rootScope, CONSTANT, postApi, $compile, modalFactory, $translate, $filter) {

    var vm = this;
    vm.dataloader = false;
  }
]);

