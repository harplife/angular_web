webapp.controller('GroupEditModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi', 'gAlert', '$rootScope', 'modalFactory', 'gConfirm', '$filter', '$translate',
  function GroupEditModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi, gAlert, $rootScope, modalFactory, gConfirm, $filter, $translate) {

    var vm = this;
    vm.dataloader = false;

    // SQL Mapper Id 정의
    var INSERT_SQL = 'WjmCampaign.updateGroupCustomer';     // 등록 SQL
    var UPDATE_SQL = 'WjmSurvey.updateSvyTarget';     // 수정 SQL
    var VIEW_SQL = 'WjmSurvey.getSvyTargetDetail'; // 조회 SQL
    var DUPCHK_SQL = 'WjmCampaign.checkGroupCustomer';         // 중복체크 SQL

    // 관련 테이블 정의
    var VIEW_TABLE_NM = 'wjm.surveytarget'; // 조회용 테이블명
    var EDIT_TABLE_NM = 'wjmsurveytarget'; // 저장용 테이블명
    var KEY_COLUMN_NM = 'KeyId'; // Primary Key Column

    vm.srch = {
      keyId : toModalData.keyId,
      GrpNm : toModalData.GrpNm,
      GrpId : toModalData.GrpId,
      Manager : toModalData.Manager
    };

    // 조회 데이터 설정
    vm.srchDetail = {};
    vm.columnMap = {};
    angular.copy(vm.srch, vm.srchDetail);
    vm.srchDetail.IdName = KEY_COLUMN_NM; // Primary Key Column
    vm.srchDetail.selectType = "Edit"; // 사용자정의 컬럼 작업 유형 : List(목록), Detail(조회), Edit(등록/수정)

    // 등록/수정 표시용 컬럼 목록
    vm.srchDetail.editColumns = {};

    // 조회 데이터

    vm.data = {
      keyId: !isNullOrEmpty(vm.srch.keyId) ? vm.srch.keyId : '',  // Primary Key Data
      tableNm: VIEW_TABLE_NM,
      Manager: vm.srch.Manager,
      GrpId : toModalData.GrpId
    };

    // 조회
    function getData() {
      vm.dataloader = true; // Progressbar 표시

      if (isNullOrEmpty(vm.srch.keyId)) {
        vm.dataloader = false;  // Progressbar 숨김
      }
      vm.srchDetail.viewColumns = {}; // 조회 컬럼

      var data = vm.srchDetail;
      data.mapCode = VIEW_SQL;

      postApi.select(data, function (result) {
        if (result.header.status == CONSTANT.HttpStatus.OK) {
          // 데이터 조회 성공
          vm.dataloader = false; // Progressbar 숨김

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

            vm.tmpMobile = vm.data.Mobile;
            vm.tmpEmail = vm.data.Email;

          } else {
            vm.data.TenantId = $rootScope.gVariable.srchTenantId;
            vm.data.TenantNm = $rootScope.gVariable.srchTenantName;
          }
        } else {
          vm.dataloader = false; // Progressbar 숨김

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

    // 등록수정 화면 표시여부
    function getIsShowColumn(columnNm) {
      var result = false;
      var itemIndex = vm.srch.editColumns.indexOf(columnNm);

      result = (itemIndex > -1);
      return result;
    }

    // 필수항목 체크
    function getIsValidData() {
      var errMsg = '';
      if (isNullOrEmpty(vm.data.Mobile) && isNullOrEmpty(vm.data.Email)) {
        errMsg = errMsg + '- 휴대폰, 이메일 중 하나는 입력해 주세요.<br/>';
      }
      if (!isNullOrEmpty(vm.data.Mobile) && vm.data.Mobile != vm.tmpMobile) {
        if (vm.dupMobile > 0) {
          errMsg = errMsg + '- 중복된 휴대폰 정보가 존재합니다.<br/>';
        }
      }
      if (!isNullOrEmpty(vm.data.Email) && vm.data.Email != vm.tmpEmail) {
        if (vm.dupEmail > 0) {
          errMsg = errMsg + '- 중복된 이메일 정보가 존재합니다.<br/>';
        }
      }
      if (!isNullOrEmpty(errMsg)) {
        gAlert('', errMsg);
        return false;
      }
      return true;
    }

    // 저장
    function setData() {

      if (getIsValidData() == false) {
        return;
      }

      // 내용
      vm.data.tableNm = EDIT_TABLE_NM;             // 작업 테이블명
      vm.data.IdName = KEY_COLUMN_NM;             // Primary Key Column
      vm.data.userkey = vm.srch.userkey;          // 사용자 식별 키

      var data = vm.data; // 사용자 입력 데이터

      // 발송대기가 아니면서 휴대폰이나 이메일이 변경된 경우 발송대기로 변경하여 재발송 대상이 되게 한다.
      if(vm.data.RespStatus != "N" &&
        ((vm.data.SendType == "S" && vm.data.Mobile != vm.tmpMobile) || (vm.data.SendType == "E" && vm.data.Email != vm.tmpEmail))) {
          vm.data.RespStatus = "N";
        }

      if (isNullOrEmpty(vm.data.keyId)) {
        // 신규 등록
        data.mapCode = INSERT_SQL;

        postApi.insert(data, function (result) {
          setInsertUpdateDetail(result);
        }, function (error) {
          console.error("Error> setData()");
          console.table(error);
        });
      } else {
        // 수정
        data.RelateDataId = data.keyId;
        data.mapCode = UPDATE_SQL;

        postApi.update(data, function (result) {
          setInsertUpdateDetail(result);
        }, function (error) {
          console.error("Error> setData()");
          gAlert('', 'Menu.EXCEPTIONOCCURED');
        });
      }
    }

    // 저장 후 처리
    function setInsertUpdateDetail(result) {
      if (result.header.status === CONSTANT.HttpStatus.OK) {
        if (
          result.body.docs[0].KeyId !== null ||
          result.body.docs[0].NewKeyId !== null ||
          result.body.docs[0].RelateDataId !== null
        ) {
          // KeyId 조회
          if (!isNullOrEmpty(result.body.docs[0].NewKeyId)) {
            vm.data.KeyId = result.body.docs[0].NewKeyId;
          } else if (!isNullOrEmpty(result.body.docs[0].KeyId)) {
            vm.data.KeyId = result.body.docs[0].KeyId;
          } else if (!isNullOrEmpty(result.body.docs[0].RelateDataId)) {
            vm.data.KeyId = result.body.docs[0].RelateDataId;
          }

          gAlert("", "Menu.SAVED", {
            btn: "",
            fn: function () {
              $uibModalInstance.close(null);
            }
          });
          return;
        }
      }

      console.error("Error> setInsertUpdateDetail()");
      gAlert('', result.body.docs[0].errMessage);
    }

    // 휴대폰, 이메일 중복 체크
    function getIsDup(type) {
      var data = {};
      switch(type){
        case "M": data = {keyId: vm.data.keyId, Mobile: vm.data.Mobile}; break;
        case "E": data = {keyId: vm.data.keyId, Email: vm.data.Email}; break;
      }
      data.mapCode = DUPCHK_SQL;
      postApi.select(data, function (result) {
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          switch(type){
            case "M": vm.dupMobile = result.body.docs.length; break;
            case "E": vm.dupEmail = result.body.docs.length; break;
          }
        } else {
          gAlert('', result.body.docs[0].errMessage);
        }
      }, function (error) {
        console.error("Error> getIsDup()");
        console.table(error);
      });
    }


    // 닫기
    function closeWin() {
      $uibModalInstance.close();
    }

    // 함수 정의
    vm.getData = getData;                     // 데이터 조회
    vm.getIsShowColumn = getIsShowColumn;     // 등록/수정 화면에 표시할 컬럼인지 여부 확인
    vm.setData = setData;                     // 데이터 저장
    vm.getIsDup = getIsDup;    // 중복 체크
    vm.closeWin = closeWin;  // 닫기

    // 데이터 조회
    //getData();


  }, ]);
