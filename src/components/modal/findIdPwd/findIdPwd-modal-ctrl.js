webapp.controller('FindIdPwdModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi', 'gAlert',
    function FindIdPwdModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi, gAlert ) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.sendMail = sendMail;
      vm.setPass = false;
      vm.find = toModalData.find;
      vm.crtfcNo = "";
      vm.success = false;
      //vm.find = 'pwd';
      //vm.success = true;
      vm.pass = false;

      (function FindIdPwdModalCtrl() {

      })();

      function ok() {
        $uibModalInstance.close();
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      function sendMail() {

        var data = {
          Email : vm.Email,
          UserNm : vm.UserNm,
          LoginId : vm.LoginId,
          mapCode : 'findIdPwd',
          find : vm.find
        };

        postApi.login(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              vm.data = result.body.docs[0];
              vm.success = true;
            }
          } else {

            gAlert('',result.body.docs[0].errMessage);
          }
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> findIdPwd-modal-ctrl> sendMail()', status, error);
        });
      }


      function getCrtfcNo() {
        var data = {
          Email : vm.data.Email,
          UserNm : vm.data.UserNm,
          LoginId : vm.data.LoginId,
          mapCode : 'getCrtfcNo',
          find : vm.find,
          CrtfcNo : vm.crtfcNo
        };

        postApi.login(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              //메일발송 관련된부분
              vm.pass = true;
            } else {
              gAlert('','인증번호를 다시 확인해주세요.');
            }
          }
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> findIdPwd-modal-ctrl> sendMail()', status, error);
        });
      }


      function setData() {

        if (getIsValidData() == false) {
          return;
        }
        var data = angular.copy(vm.data);
        data.mapCode = 'updateUserPass';
        postApi.login(data, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              //메일발송 관련된부분
              vm.setPass = true;
            } else {
              gAlert('','인증번호를 다시 확인해주세요.');
            }
          }
          vm.dataloader = false;
        }, function(error) {
          console.error('Error> findIdPwd-modal-ctrl> sendMail()', status, error);
        });

      }



      /**
       * 비밀번호 체크
       *
       * @param
       * @return
       */
      function getIsValidPassword() {
        var reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_;:<>,.[\]{\}])[A-Za-z\d!@#$%^&*()\-_;:<>,.[\]{\}]+$/g;
        var birthDay = moment(vm.data.BirthDay).format('MMDD');
        var birthDay2 = moment(vm.data.BirthDay).format('YYMMDD');

        if(!reg.test(vm.data.Password)) return false;
        if(vm.data.Password.indexOf(birthDay) > -1) return false;
        if(vm.data.Password.indexOf(birthDay2) > -1) return false;
        if(vm.data.Password.length < 8) return false;

        return true;

      }

      function getIsValidData() {
        // #region 필수항목 체크
        var errMsg = '';

        if (!isNullOrEmpty(vm.data.KeyId) && isNullOrEmpty(vm.data.Password)) {
          errMsg = errMsg + '- 비밀번호를 입력하세요.<br/>';
        }

        if (vm.data.Password != vm.data.Password2) {
          errMsg = errMsg + '- 비밀번호가 일치하지 않습니다.<br/>';
        }

        if (!isNullOrEmpty(vm.data.Password)) {
          if (!getIsValidPassword()) {
            errMsg = errMsg + '- 비밀번호 형식을 확인해 주세요.<br/>';
          }
        }
        if (!isNullOrEmpty(errMsg)) {
          gAlert('', errMsg);
          return false;
        }
        return true;
      }

      vm.getCrtfcNo = getCrtfcNo;
      vm.setData = setData;
    } ]);
