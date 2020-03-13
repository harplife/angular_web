webapp.controller('FreModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', 'gAlert', 'gConfirm',
    function FreModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi, gAlert, gConfirm) {
      var vm = this;

      // html 에서 사용하는 함수 연결
      vm.ok = ok;
      vm.cancel = cancel;
      vm.setData = setData;
      vm.setDelData = setDelData;

      (function FreModalCtrl() {
        vm.srch = {
          keyId: toModalData.keyId,
          message: toModalData.message
        };

        vm.data = {};
        vm.MessageBytes = "0";

        if (!isNullOrEmpty(vm.srch.keyId)) {
          getDetail();
        }
        else {
          vm.data.Message = vm.srch.message;
        }
      })();

      /**
       * 내용 바이트 체크
       *
       * @param
       * @return
       */
      vm.chkMessage = function () {
        var msg = "";
        var bytes = 0;

        msg = vm.data.Message;
        bytes = msg.length + (escape(msg) + "%u").match(/%u/g).length - 1;

        if (bytes > 90) {
          vm.data.Message = fnCutMsg(msg, 90);
          bytes = 90;
        }

        vm.MessageBytes = bytes;
      };

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
       * 자주 사용하는 메세지 조회
       *
       * @param
       * @return
       */
      function getDetail() {
        var data = vm.srch;
        data.mapCode = 'Campaign.getFrequsedmsgDetail';

        postApi.select(data, function (result) {
          if (result.header.status == CONSTANT.HttpStatus.OK) {
            vm.data = result.body.docs[0];
          }
        });
      }

      /**
       * 자주 사용하는 메세지 저장
       *
       * @param
       * @return
       */
      function setData() {
        if (getIsValidData() == false) {
          return;
        }

        var data = vm.data; // 사용자 입력 데이터
        data.keyId = vm.srch.keyId;

        if (isNullOrEmpty(data.keyId)) {
          // 신규 등록
          data.mapCode = 'Campaign.insertFrequsedmsg';

          postApi.insert(data, function (result) {
            vm.srch.keyId = result.body.docs[0].RelateDataId;
            setInsertUpdateDetail(result);
          }, function (error) {
            console.error("Error> setData()");
            console.table(error);
          });
        } else {
          // 수정
          data.mapCode = 'Campaign.updateFrequsedmsg';

          postApi.update(data, function (result) {
            setInsertUpdateDetail(result);
          }, function (error) {
            console.error("Error> setData()");
            gAlert('', 'Menu.EXCEPTIONOCCURED');
          });
        }
      }

      /**
       * 자주 사용하는 메세지 저장 후 처리
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
                // 화면 분할 모드에 따른 이동
                //goNextPage(true);
                ok();
              }
            });
            return;
          //}
        }

        console.error("Error> setInsertUpdateDetail()");
        gAlert('', result.body.docs[0].errMessage);
      }

      /**
       * 필수항목 체크
       * @param
       * @return
       */
      function getIsValidData() {
        var errMsg = '';
        if (isNullOrEmpty(vm.data.Subject)) {
          errMsg = errMsg + '- 제목을 입력하세요.<br/>';
        }

        if (isNullOrEmpty(vm.data.Message)) {
          errMsg = errMsg + '- 내용을 선택하세요.<br/>';
        }

        if (!isNullOrEmpty(errMsg)) {
          gAlert('', errMsg);
          return false;
        }

        return true;
      }

      /**
       * 데이터 삭제 확인
       *
       * @param
       * @return
       */
      function setDelData() {
        gConfirm('', 'Menu.DELETECONFIRM', {
          btn: '',
          fn: function () {
            // 데이터 삭제
            setDelDataAction();
          }
        }, {
          btn: '',
          fn: function () {
            // 취소
          }
        });
      }

      /**
       * 데이터 삭제
       *
       * @param
       * @return
       */
      function setDelDataAction() {
        if (vm.data == null) {
          // 삭제할 데이터 미 존재
          gAlert('', 'Menu.CANNOTDELETE');
          return;
        }

        // 첨부파일 삭제
        /*
        var uploadFileList = [];
        angular.forEach(vm.uploadFileList, function (item) {
          var obj = {
            id: item.id,
            fileName: item.fileName,
            size: item.size,
            fileKey: item.fileKey,
            typeId: 'file',
            path: item.path,
            delState: 'delete'
          };
          uploadFileList.push(obj);

        });
        vm.data['uploadFileList'] = uploadFileList;
        */

        //vm.data.tableNm = KEY_TABLE_NM;

        var data = vm.data;
        data.mapCode = "Campaign.deleteFrequsedmsgDetail";

        postApi.update(data, function (result) {
          if (result.header.status == CONSTANT.HttpStatus.OK) {
            gAlert('', 'Menu.DELETED', {
              btn: '',
              fn: function () {
                // 삭제 성공
                //var srch = $stateParams.srch;

                // 목록 화면 이동
                /*
                $state.go(LIST_PAGE_URL, {
                    srch: srch
                  },
                  {reload: LIST_PAGE_URL});
                  */
                ok();
              }
            });

          }
        }, function (error) {
          // 삭제 중 오류 발생
          console.error("Error> setDelDataAction()");
          console.table(error);
        });
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

      /**
       * 성공 이벤트
       *
       * @param
       * @return
       */
      function ok() {
        $uibModalInstance.close(null);
      }
    } ]);
