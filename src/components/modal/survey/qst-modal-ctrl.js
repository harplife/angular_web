webapp.controller('QstModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi', 'gAlert', 'gConfirm',
    function QstModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi, gAlert, gConfirm) {
      var vm = this;

      // html 에서 사용하는 함수 연결
      vm.close = close;
      vm.setQstData = setQstData;
      vm.setDelQstItemData = setDelQstItemData;

      (function QstModalCtrl() {
        vm.srch = {
          keyId: toModalData.keyId,
          keyId2: toModalData.keyId2,
          qstType: toModalData.qstType
        };

        //console.log("test", vm.srch);
        vm.data = {};

        if (!isNullOrEmpty(vm.srch.keyId2)) {
          getQstDetail();
        }
        else {
          vm.data.QstType = vm.srch.qstType;
          getQstTypeCodeList();
        }
      })();

      /**
       * 문제 조회
       *
       * @param
       * @return
       */
      function getQstDetail() {
        var data = vm.srch;
        data.mapCode = 'Survey.getSurveyqstDetail';

        postApi.select(data, function (result) {
          if (result.header.status == CONSTANT.HttpStatus.OK) {
            vm.data = result.body.docs[0];

            getQstItemList();
          }
        });
      }

      /**
       * 문제항목 목록
       *
       * @param
       * @return
       */
      function getQstItemList() {
        var data = vm.srch;
        data.mapCode = 'Survey.getSurveyqstitemList';

        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            vm.qstItemLists = result.body.docs;

            // 주관식일 경우
            if (vm.data.QstType == "300" && !isNullOrEmpty(vm.qstItemLists) && vm.qstItemLists.length > 0) {
              vm.data.QstItemScore = vm.qstItemLists[0].QstItemScore;
            }

            getQstTypeCodeList();
            /*
            var resList = [];
            var res = '';

            if (vm.tenantlists != null) {
              angular.forEach(vm.tenantlists, function (item) {
                 resList = [];
                 if (item.Addr1 != undefined) {
                  res = item.Addr1;
                  resList = res.split(" ");
                  item.Addr1 = resList[0] + " " + resList[1];
                 }
              });
            }
            */
          }
        });
      }

      /**
       * 공통코드 목록
       *
       * @param
       * @return
       */
      function getQstTypeCodeList() {
        var data = vm.srch;

        if (!isNullOrEmpty(vm.QstTypeCodeList)) return;

        vm.srch.CodeType = "QSTTYPE";
        data.mapCode = 'CommonCode.getCommonCodeList';

        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            vm.QstTypeCodeList = result.body.docs;
            /*
            var resList = [];
            var res = '';

            if (vm.tenantlists != null) {
              angular.forEach(vm.tenantlists, function (item) {
                 resList = [];
                 if (item.Addr1 != undefined) {
                  res = item.Addr1;
                  resList = res.split(" ");
                  item.Addr1 = resList[0] + " " + resList[1];
                 }
              });
            }
            */
          }
        });
      }

      /**
       * 문제 저장
       *
       * @param
       * @return
       */
      function setQstData() {
        if (getIsValidData() == false) {
          return;
        }

        vm.data.keyId = vm.srch.keyId;
        vm.data.keyId2 = vm.srch.keyId2;

        var data = vm.data; // 사용자 입력 데이터

        if (isNullOrEmpty(vm.data.keyId2)) {
          // 신규 등록
          data.mapCode = 'Survey.insertSurveyqst';

          postApi.insert(data, function (result) {
            vm.srch.keyId2 = result.body.docs[0].RelateDataId;

            setQstItemData("ADD", 0, result);
          }, function (error) {
            console.error("Error> setQstData()");
            console.table(error);
          });
        } else {
          // 수정
          //data.RelateDataId = data.keyId2;
          data.mapCode = 'Survey.updateSurveyqst';

          postApi.update(data, function (result) {
            setQstItemData("ADD", 0, result);
          }, function (error) {
            console.error("Error> setQstData()");
            gAlert('', 'Menu.EXCEPTIONOCCURED');
          });
        }
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
                // 화면 분할 모드에 따른 이동
                //goNextPage(true);
                getQstDetail();
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
        if (isNullOrEmpty(vm.data.QstNo)) {
          errMsg = errMsg + '- No를 입력하세요.<br/>';
        }

        if (isNullOrEmpty(vm.data.QstType)) {
          errMsg = errMsg + '- 구분을 선택하세요.<br/>';
        }

        if (isNullOrEmpty(vm.data.QstSubject)) {
          errMsg = errMsg + '- 제목을 입력하세요.<br/>';
        }

        if (vm.data.QstType == "300") {
          if (isNullOrEmpty(vm.data.QstItemScore)) {
            errMsg = errMsg + '- 배점을 입력하세요.<br/>';
          }
        }
        else {
          if (isNullOrEmpty(vm.qstItemLists)) {
            if (isNullOrEmpty(vm.data.NewQstItemNo)) {
              errMsg = errMsg + '- 항목 No를 입력하세요.<br/>';
            }

            if (isNullOrEmpty(vm.data.NewQstItemContents)) {
              errMsg = errMsg + '- 항목 내용을 입력하세요.<br/>';
            }

            if (isNullOrEmpty(vm.data.NewQstItemScore)) {
              errMsg = errMsg + '- 항목 배점을 입력하세요.<br/>';
            }
          }
          else {
            angular.forEach(vm.qstItemLists, function (item) {
              if (isNullOrEmpty(item.QstItemNo) || isNullOrEmpty(item.QstItemContents) || isNullOrEmpty(item.QstItemScore)) {
                errMsg = errMsg + '- 기존 문제항목 데이터중 빈항목이 존재합니다.<br/>';
              }
            });
          }
        }

        if (!isNullOrEmpty(errMsg)) {
          gAlert('', errMsg);
          return false;
        }

        return true;
      }

      /**
       * 문제항목 저장
       *
       * @param
       * @return
       */
      function setQstItemData(type, rowIdx, qstResult) {
        var data = vm.srch; // 사용자 입력 데이터

        // 주관식일 경우
        if (vm.data.QstType == "300") {
          if (isNullOrEmpty(vm.data.keyId2)) {
            // 신규 등록
            data.QstItemNo = "1";
            data.QstItemContents = "주관식문제항목";
            data.QstItemScore = vm.data.QstItemScore;
            data.mapCode = 'Survey.insertSurveyqstitem';

            postApi.insert(data, function (result) {
              setInsertUpdateDetail(qstResult);
            }, function (error) {
              console.error("Error> setQstItemData()");
              console.table(error);
            });
          }
          else {
            // 수정
            data = vm.qstItemLists[0];
            data.keyId3 = data.KeyId3;
            data.QstItemScore = vm.data.QstItemScore;
            data.mapCode = 'Survey.updateSurveyqstitem';

            postApi.update(data, function (result) {
              setInsertUpdateDetail(qstResult);
            }, function (error) {
              console.error("Error> setQstItemData()");
              gAlert('', 'Menu.EXCEPTIONOCCURED');
            });
          }
        }
        else {
          if (type == "ADD") {
            // 신규 등록
            data.QstItemNo = vm.data.NewQstItemNo;
            data.QstItemContents = vm.data.NewQstItemContents;
            data.QstItemScore = vm.data.NewQstItemScore;
            data.mapCode = 'Survey.insertSurveyqstitem';

            if (isNullOrEmpty(data.QstItemNo) || isNullOrEmpty(data.QstItemContents) || isNullOrEmpty(data.QstItemScore)) {
              if (!isNullOrEmpty(vm.qstItemLists)) {
                setQstItemData("MODIFY", 0, qstResult);
              }
              else {
                setInsertUpdateDetail(qstResult);
              }

              return;
            }

            postApi.insert(data, function (result) {
              vm.data.NewQstItemNo = "";
              vm.data.NewQstItemContents = "";
              vm.data.NewQstItemScore = "";

              if (!isNullOrEmpty(vm.qstItemLists)) {
                setQstItemData("MODIFY", 0, qstResult);
              }
              else {
                setInsertUpdateDetail(qstResult);
              }
            }, function (error) {
              console.error("Error> setQstItemData()");
              console.table(error);
            });
          } else {
            // 수정
            data = vm.qstItemLists[rowIdx];
            data.keyId3 = data.KeyId3;
            data.mapCode = 'Survey.updateSurveyqstitem';

            postApi.update(data, function (result) {
              rowIdx++;
              if (vm.qstItemLists.length > rowIdx) {
                setQstItemData("MODIFY", rowIdx, qstResult);
              }
              else {
                setInsertUpdateDetail(qstResult);
              }
            }, function (error) {
              console.error("Error> setQstItemData()");
              gAlert('', 'Menu.EXCEPTIONOCCURED');
            });
          }
        }
      }

      /**
       * 문제항목 삭제
       *
       * @param
       * @return
       */
      function setDelQstItemData(keyId3) {
        var data = {};
        data.keyId3 = keyId3;
        data.mapCode = "Survey.deleteSurveyqstitemList";

        postApi.update(data, function (result) {
          if (result.header.status == CONSTANT.HttpStatus.OK) {
            getQstItemList();
          }
        }, function (error) {
          // 삭제 중 오류 발생
          console.error("Error> setDelQstItemData()");
          console.table(error);
        });
      }

      /**
       * 닫기 버튼 이벤트
       *
       * @param
       * @return
       */
      function close() {
        $uibModalInstance.dismiss('close data');
      }
    } ]);
