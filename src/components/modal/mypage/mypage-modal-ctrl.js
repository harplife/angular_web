webapp.controller('MyPageModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi', 'gAlert', '$rootScope',
    function FindIdPwdModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi, gAlert, $rootScope ) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.keyId = toModalData.UserId;
      vm.TenantId = toModalData.TenantId;

      //function
      vm.setData = setData;
      vm.getData = getData;

      var VIEW_SQL = 'User.getUserMgrDetail'; // 조회 SQL
      var UPDATE_SQL = 'User.updateMyPage';     // 수정 SQL

      // 관련 테이블 정의
      var KEY_TABLE_NM = 'Users'; // 작업 테이블명
      var KEY_COLUMN_NM = 'KeyId'; // Primary Key Column

      // 조회 데이터 설정
      vm.srchDetail = {};
      vm.columnMap = {};
      vm.srchDetail.IdName = KEY_COLUMN_NM; // Primary Key Column
      vm.srchDetail.selectType = "Edit"; // 사용자정의 컬럼 작업 유형 : List(목록), Detail(조회), Edit(등록/수정)
      vm.srchDetail.keyId = vm.keyId;
      vm.srchDetail.tableNm = KEY_TABLE_NM;

      // 등록/수정 표시용 컬럼 목록
      vm.srchDetail.editColumns = {};

      // 조회 데이터
      vm.data = {
        KeyId: vm.keyId, // Primary Key Data
        tableNm: KEY_TABLE_NM                                      // 작업 테이블명
      };

      (function MyPageModalCtrl() {

      })();

      function ok() {
        $uibModalInstance.close();
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      /**
       * 데이터 조회
       * @param
       * @return
       */
      function getData() {

        vm.srchDetail.viewColumns = {}; // 조회 컬럼

        var data = vm.srchDetail;
        data.mapCode = VIEW_SQL;

        postApi.select(data, function (result) {
          if (result.header.status == CONSTANT.HttpStatus.OK) {
            // 데이터 조회 성공

            if (result.body.desc.length > 0) {
              // 사용자정의 컬럼 설정
              vm.allColumns = result.body.desc;
              angular.forEach(vm.allColumns, function (item) {
                vm.columnMap[item.ColumnPhysicalNm] = item;
              });
            }

            if (result.body.docs.length > 0) {
              // 조회 데이터 설정
              vm.data = result.body.docs[0];
              vm.data.keyId = result.body.docs[0].KeyId != null ? result.body.docs[0].KeyId : '';

              //Date형식 처리
              if (vm.data.BirthDay != null && vm.data.BirthDay != "") vm.BirthDay = moment(vm.data.BirthDay).toDate();


            }
          } else {
            console.error("Error> getData()");

            if (!isNullOrEmpty(result.body.docs)) {
              gAlert('', result.body.docs[0].errMessage);
            }
          }

        }, function (error) {
          console.error("Error> getData()");
          console.table(error);
        });
      }

      /**
       * 데이터 저장
       *
       * @param
       * @return
       */
      function setData() {

        // #region 필수항목 체크
        var errMsg = '';
        if (isNullOrEmpty(vm.data.UserNm))
          errMsg = errMsg + '- 사용자명을 입력하십시오.<br/>';

        if (vm.data.Password != vm.data.Password2)
          errMsg = errMsg + '- 비밀번호가 일치하지 않습니다.<br/>';

        if (!isNullOrEmpty(vm.data.Password)){
          if (!chkPass())
          errMsg = errMsg + '- 비밀번호 형식을 확인해주세요.<br/>';
        }

        if (!isNullOrEmpty(errMsg)) {
          gAlert('', errMsg);
          return false;
        }


        // #endregion 필수항목 체크

        // 내용
        vm.data.tableNm = KEY_TABLE_NM;             // 작업 테이블명
        vm.data.IdName = KEY_COLUMN_NM;             // Primary Key Column
        vm.data.userkey = $rootScope.gVariable.userkey;       // 사용자 식별 키
        vm.data.BirthDay = moment(vm.data.BirthDay).format('YYYY-MM-DD');
        var data = vm.data; // 사용자 입력 데이터

        // 수정
        data.RelateDataId = data.keyId;
        data.mapCode = UPDATE_SQL;

        postApi.update(data, function (result) {
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (
              result.body.docs[0].KeyId !== null ||
              result.body.docs[0].NewKeyId !== null
            ) {
              // KeyId 조회
              vm.data.keyId = !isNullOrEmpty(result.body.docs[0].NewKeyId) ? result.body.docs[0].NewKeyId : result.body.docs[0].KeyId;

              gAlert("", "Menu.SAVED", {
                btn: "",
                fn: function () {
                  ok();
                }
              });
              return;
            }
          }
        }, function (error) {
          console.error("Error> setData()");
          console.table(error);
        });

      }

      /**
       * 비밀번호 체크
       *
       * @param
       * @return
       */
      function chkPass() {
        var reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_;:<>,.[\]{\}])[A-Za-z\d!@#$%^&*()\-_;:<>,.[\]{\}]+$/g;
        var birthDay = moment(vm.data.BirthDay).format('MMDD');
        var birthDay2 = moment(vm.data.BirthDay).format('YYMMDD');

        if(!reg.test(vm.data.Password)) return false;
        if(vm.data.Password.indexOf(birthDay) > -1) return false;
        if(vm.data.Password.indexOf(birthDay2) > -1) return false;
        if(vm.data.Password.length < 8) return false;
        if(!isNullOrEmpty(vm.data.keyId)) setMallFW();


        return true;

      }

      function setMallFW(param) {
        var param = {};
        param.rTenantID = $rootScope.gVariable.srchTenantId;
        param.rUserID = vm.data.KeyId;
        param.rLoginID = vm.data.LoginId;
        param.rShopTentID = vm.data.TenantId;
        param.mapCode = "remoteJfc";
        param.remoteAction = "setChangePw";
        param.rUserPw = vm.data.Password;

        postApi.openApi(param, function (result) {
          if (result.header.status === CONSTANT.HttpStatus.OK) {
          } else {
          }
        });
      }


      getData();
    } ]);
