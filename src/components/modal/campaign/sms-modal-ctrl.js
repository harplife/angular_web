webapp.controller('SmsModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', 'gAlert', 'gConfirm', 'modalFactory',
    function SmsModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi, gAlert, gConfirm, modalFactory) {
      var vm = this;

      // html 에서 사용하는 함수 연결
      vm.cancel = cancel;
      vm.setData = setData;
      vm.setFreMessage = setFreMessage;

      (function SmsModalCtrl() {
        vm.srch = {
          keyId: toModalData.keyId
        };

        vm.data = {};
        vm.MessageBytes = "0";

        if (isNullOrEmpty(vm.srch.keyId)) cancel();

        getFreList();
        getSendHourList();
        getSendTimeList();
      })();

      /**
       * 자주 사용하는 메세지 팝업 호출
       *
       * @param {string}
       * @return {boolean}
       */
      vm.srchFreModal = function (keyId) {
        var ctrl = 'FreModalCtrl as vc';
        var message = "";

        if (isNullOrEmpty(keyId)) {
          message = vm.data.SendMessage;
        }

        var paramData = {keyId: keyId, message: message};
        var modalInstance = modalFactory.open('modal', 'components/modal/campaign/fre-modal.html', ctrl, paramData);

        modalInstance.result.then(function (okData) {
          getFreList();
        }, function (cancelData) {
        });
      };

      /**
       * 발송내용 바이트 체크
       *
       * @param
       * @return
       */
      vm.chkSendMessage = function () {
        var msg = "";
        var bytes = 0;

        msg = vm.data.SendMessage;
        bytes = msg.length + (escape(msg) + "%u").match(/%u/g).length - 1;

        if (bytes > 90) {
          vm.data.SendMessage = fnCutMsg(msg, 90);
          bytes = 90;
        }

        vm.SendMessageBytes = bytes;
      };

      /**
       * 자주 사용하는 메세지 목록 조회
       *
       * @param
       * @return
       */
      function getFreList() {
        //vm.dataloader = true; // Progressbar 표시

        var data = vm.srch; // 검색 옵션 설정
        data.mapCode = "Campaign.getFrequsedmsgList";

        postApi.select(data, function (result) {
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            //console.log("re", result);
            if (result.body.docs.length > 0) {
              // 목록 데이터 표시
              vm.freLists = result.body.docs;
              vm.freTotalItems = vm.freLists.length;
            } else {
              // 데이터 조회 실패
              vm.freLists = {};
              vm.freTotalItems = 0;
            }
          }

          //vm.dataloader = false; // Progressbar 숨김
        }, function (error) {
          //vm.dataloader = false; // Progressbar 숨김

          // 조회 중 오류 발생
          console.error("Error> getFreList()");
          console.table(error);
        });
      }

      /**
       * 발송시간 코드
       *
       * @param
       * @return
       */
      function setFreMessage(message) {
        vm.data.SendMessage = message;

      }

      /**
       * 발송시간 코드
       *
       * @param
       * @return
       */
      function getSendHourList() {
        vm.sendHourList = [
          {time:"09"}
          , {time:"10"}
          , {time:"11"}
          , {time:"12"}
          , {time:"13"}
          , {time:"14"}
          , {time:"15"}
          , {time:"16"}
          , {time:"17"}
          , {time:"18"}
          , {time:"19"}
          , {time:"20"}
        ];
      }

      /**
       * 발송분 코드 목록
       *
       * @param
       * @return
       */
      function getSendTimeList() {
        vm.sendMinList = [
          {time:"00"}
          , {time:"10"}
          , {time:"20"}
          , {time:"30"}
          , {time:"40"}
          , {time:"50"}
        ];
      }

      /**
       * 메세지 글 자르기
       * @param
       * @return
       */
      function fnCutMsg(str, length) {
        var ret = '';
        var i;
        var msglen = 0;

        for (i = 0; i < str.length; i++) {
          var ch = str.charAt(i);

          if (escape(ch).length > 4) {
            msglen += 2;
          } else {
            msglen++;
          }
          if (msglen > length) break;
          ret += ch;
        }
        return ret;
      }

      /**
       * 필수항목 체크
       * @param
       * @return
       */
      function getIsValidData() {
        var errMsg = '';

        if (isNullOrEmpty(vm.srch.keyId)) {
          errMsg = errMsg + '- 대상그룹이 없습니다.<br/>';
        }

        if (isNullOrEmpty(vm.data.SendTelno)) {
          errMsg = errMsg + '- 발신번호를 입력하세요.<br/>';
        }

        if (vm.data.SendDateType == "200") {
          if (isNullOrEmpty(vm.data.SendDt)) {
            errMsg = errMsg + '- 발송일을 선택하세요.<br/>';
          }

          if (isNullOrEmpty(vm.data.SendHour)) {
            errMsg = errMsg + '- 발송시간(시)을 선택하세요.<br/>';
          }

          if (isNullOrEmpty(vm.data.SendMin)) {
            errMsg = errMsg + '- 발송시간(분)을 선택하세요.<br/>';
          }
        }

        if (isNullOrEmpty(vm.data.SendMessage)) {
          errMsg = errMsg + '- 발송내용을 입력하세요.<br/>';
        }

        if (!isNullOrEmpty(errMsg)) {
          gAlert('', errMsg);
          return false;
        }

        return true;
      }

      /**
       * 문제 저장
       *
       * @param
       * @return
       */
      function setData() {
        if (getIsValidData() == false) {
          return;
        }

        var data = vm.data; // 사용자 입력 데이터
        data.GrpId = vm.srch.keyId;
        data.SendType = "20";
        data.SendDtType = "";

        if (data.SendDateType == "200") data.SendDate = data.SendDt + " " + data.SendHour + ":" + data.SendMin + ":00";

        // 신규 등록
        data.mapCode = 'Campaign.updateSMSHistGroup';

        postApi.insert(data, function (result) {
          setInsertUpdateDetail(result);
        }, function (error) {
          console.error("Error> setQstData()");
          console.table(error);
        });
      }

      /**
       * 문제 저장 후 처리
       *
       * @param result - 저장 결과
       * @return
       */
      function setInsertUpdateDetail(result) {
        //console.log("res", result);
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          /*
          if (
            result.body.docs[0].KeyId !== null ||
            result.body.docs[0].NewKeyId !== null
          ) {
          */
            // KeyId 조회
            //vm.data.keyId = !isNullOrEmpty(result.body.docs[0].NewKeyId) ? result.body.docs[0].NewKeyId : result.body.docs[0].KeyId;
            gAlert("", "Menu.SAVED", {
              btn: "",
              fn: function () {
                cancel();
              }
            });
            return;
          //}
        }

        console.error("Error> setInsertUpdateDetail()");
        gAlert('', result.body.docs[0].errMessage);
      }

      /**
       * 취소 버튼 이벤트
       *
       * @param
       * @return
       */
      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }
    } ]);
