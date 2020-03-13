/**
 * 자세한 옵션은 https://angular-ui.github.io/bootstrap/ 의 Modal 항목 참고
 *
 * 사용 예제
 *
 * <pre>
 * 모달을 사용하는 측 모달 열기
 * var modalInstance = modalFactory.open('lg', 'html/changemng/req-change.html',
 * 		'ReqChangeController', data: modal측에 전달할 객체);
 * 모달 외부에서 내부로 값 전달 하는 방법
 * data에 데이터를 넣고, 모달의 내부에서 사용하는 controller에서
 * gmsController.controller('ReqChangeController', [ '$scope','$uibModalInstance','toModalData',
 * 	function($scope, $uibModalInstance, toModalData) {
 * console.log(JSON.stringify(toModalData));
 * 이런식으로 하면 toModalData안에 데이터가 들어있게 된다.
 *
 * 모달에서 처리된 값 받기
 * modalInstance.result.then(function(data) {
 * 	console.log(JSON.stringify(data))
 * }, function() {
 * 	$log.info('Modal dismissed at: ' + new Date());
 * });
 *
 * 모달 내부에서 외부로 값 전달 하는 방법
 * 확인 버튼
 * $uibModalInstance.close($scope.reqChangeModel);
 * - modalInstance.result.then(function(data) 모달을 사용하는 측에서 data에 값이 들어오게 된다.
 *
 * 취소 버튼
 * $uibModalInstance.dismiss('cancel');
 * - modalInstance.result.then 이부분이 호출되지 않게 된다.
 *
 *
 * </pre>
 */

webapp.factory('modalFactory', [ '$uibModal', '$rootScope', ModalFactory ]);

function ModalFactory($uibModal, $rootScope) {
  var modalInstance = {};
  // $uibModalInstance

  modalInstance.open = function(size, templateUrl, controller, data, options) {
    var modal = $uibModal.open({
      animation : false,
      templateUrl : templateUrl,
      controller : controller,
      // size - (Type: string, Example: lg)
      // Optional suffix of modal window class. The value used is appended
      // to the modal- class, i.e. a value of sm gives modal-sm.
      size : size,
      backdrop : 'static',
      // 키보드 esc로 모달을 닫을지 여부
      keyboard : options && options.keyboard ? options.keyboard : false,
      windowTemplate : 'ui/template/modal/window.html',
      // 모달 외부로 부터 내부로 전달 받을 값
      resolve : {
        toModalData : function() {
          return data;
        }
      }
    });
    return modal;
  };
  return modalInstance;
};
