(function() {
  "use strict";
  SignupStepTwoController.$inject = ['$scope', '$log', '$state', '$filter', '$cookies', '$rootScope', 'MAIN', 'LoginAPISrv', 'GLOBAL_CONSTANT', 'gAlert', '$window', '$translate', '$stateParams', 'customFieldApi','postApi'];

  /** @ngInject */
  function SignupStepTwoController($scope, $log, $state, $filter, $cookies, $rootScope, MAIN, loginApi, CONSTANT, gAlert, $window, $translate, $stateParams, customFieldApi, postApi) {
    var vm = this;
      // 페이징
    vm.tenantId = $stateParams.tenantId;
    // 사용자정의 컬럼 폼
    vm.udcForm = {};

    // 사용자정의 컬럼 모델
    vm.udcModel = {};
    vm.udcDataType = {};

    // 사용자정의 컬럼정보
    vm.udcColumns = [];
    vm.columnMap = {};
    vm.srchDetail = {};
    vm.srchDetail.viewColumns = {};

    vm.metaList = [];
    vm.metaModel = [];
    vm.initalized = false;

    vm.udcOptions = {
      formState: {
        horizontalLabelClass: "",
        horizontalFieldClass: "",
        readOnly: false
      }
    };
    vm.result = false;
    var srchTenantName = ($window.sessionStorage['loginTenantNm'] !== null) ? $window.sessionStorage['loginTenantNm'] : '';
    vm.goCancel = goCancel;
    vm.salemeetGoCancel = salemeetGoCancel;
    vm.stateParams = {
      UserId : $stateParams.UserId,
    };

    // 검색 조건
    vm.srch = {
      UserId : $stateParams.UserId,
      TableId : $stateParams.UserId,
      tableNm : 'users',
    };

    // 등록/수정 표시용 컬럼 목록
    vm.srch.editColumns = [];

    // 조회 데이터
    vm.data = {
      UserId : $stateParams.UserId,
      TenantNm : srchTenantName,
      tableNm : 'users',
      checkedLoginId : '',
      Mobile1 : '010'
    };

    vm.joinVisible = false;

    vm.onDateChanged = function(ColumnPhysicalNm, index) {
//    vm.metaModel[ColumnPhysicalNm] = $filter('date')(vm.RegDate[index], 'yyyy-MM-dd', 'UTC');
      vm.data[ColumnPhysicalNm] = (new Date(vm.RegDate[index])).getTime();
    };

    /**
     * 데이터 저장
     *
     * @param
     * @return
     * @author 최원영
     */
    function setData() {
      if(!$scope.form1.$valid) {
          return false;
      }

      if (typeof(vm.data.LoginId) == "undefined" || vm.data.LoginId == "") {
        gAlert('', '아이디를 입력후 중복확인을 해주세요.');
        return false;
      }

      if (vm.data.checkedLoginId != vm.data.LoginId) {
        gAlert('', '아이디를 입력후 중복확인을 해주세요.');
        return false;
      }

      if (vm.data.Password.length < 8) {
        gAlert('', '비밀번호는 8자리 이상입니다.');
        return false;
      }

      if (vm.data.Password != vm.data.Password2) {
        gAlert('', '비밀번호확인을 확인해주세요.');
        return false;
      }

      var spe = vm.data.Password.search(/[`.~!@@#$%^&*()|\\\'\";:\/?-_=+]/gi);

      if (vm.data.Password.search(/\s/) != -1) {
        gAlert('', '비밀번호는 공백없이 입력해주세요.');
        return false;
      }
      if (spe < 0) {
        gAlert('', '비밀번호에 특수문자를 혼합하여 입력해주세요.');
        return false;
      }

      if(document.getElementById("termsY").checked != true) {
        gAlert('', '이용약관, 개인정보보호정책에 동의해주세요.');
        return false;
      }

      vm.data.UseYN = 'Y'; // 사용여부
      vm.data.UserType = '30'; // 사용자구분
      vm.data.LoginId = vm.UserId;
      vm.data.Email = vm.data.Email1 + '@' + vm.data.Email2;
      vm.data.Mobile = vm.data.Mobile1 + '-' + vm.data.Mobile2 + '-' + vm.data.Mobile3;

      // 내용
      vm.data.tableNm = "users";
      vm.data.TableId = vm.data.UserId;
      vm.data.tenantId = vm.tenantId;
      var prms = null;
      if (typeof(vm.data.UserId) == "undefined" || vm.data.UserId == 0) {
        // 등록
        prms = loginApi.doCreateUser().post(vm.data).$promise;
      } else {
        // 수정
        //prms = loginApi.doUpdateUserDetail().post(vm.data).$promise;
      }

      prms.then(function(data) {
        if (data.responseVO.header.status === CONSTANT.HttpStatus.OK) {
          if (data.responseVO.body.docs[0].UserId !== null || data.responseVO.body.docs[0].TableId !== null) { // insert시 TableId 만 넘어옴
            // KeyId 조회
            vm.data.UserId = data.responseVO.body.docs[0].UserId;
            $('#tab2').removeClass("current");
            $('#tab3').addClass("current");
            vm.result = true;
            return;
          }
        }
        gAlert('', data.responseVO.body.docs[0].errMessage);
      }, function(error) {
        console.error('Error-setData', status, data);
        gAlert('', data.responseVO.body.docs[0].errMessage);
      });
    }

    // 사용자 중복체크
    function chkDupLoginId() {
      vm.data.LoginId = vm.UserId;

      if(!chkId()) {
        gAlert('', '사용할 수 없는 아이디 입니다.');
        return;
      }

      var prms = null;

      prms = loginApi.doCheckLoginId().post(vm.data).$promise;
      prms.then(function(data) {
        if (data.responseVO.header.status === CONSTANT.HttpStatus.OK) {
          if (data.responseVO.body.docs[0].message == '사용가능한 아이디입니다.') {
            vm.data.checkedLoginId = vm.data.LoginId;
            gAlert('', '사용가능한 아이디 입니다.');
          }
          else {
            vm.data.checkedLoginId = "";
            gAlert('', '이미 사용중인  아이디 입니다.');
          }

          return;
        }
        gAlert('', data.responseVO.body.docs[0].errMessage);
      }, function(error) {
        console.error('Error-setData', status, data);
        gAlert('', data.responseVO.body.docs[0].errMessage);
      });
    }

    // ID 체크
    function chkId() {
      var regExp = /^[a-z0-9\-_]{5,25}$/;

      if (!regExp.test(vm.UserId)) return false;
      if (vm.UserId.search(/\s/) != -1) return false;

      return true;
    }

    // 사용자 중복체크
    function setEmail() {
      vm.data.Email2 = vm.data.Email3;
    }

    function getColunmList() {
      var data = {
        tableNm : 'users',
        tenantId : vm.tenantId,
        mapCode : 'getMetaColumns',
        selectType : "Edit",
      };

      postApi.login(data,function(result) {
        if (result.header.status === CONSTANT.HttpStatus.OK) {

          if (result.body.desc.length > 0) {
            vm.allColumns = result.body.desc;
            angular.forEach(vm.allColumns, function(item) {
              vm.columnMap[item.ColumnPhysicalNm] = item;
            });
          }

          if (result.body.docs.length > 0) {
            vm.data = result.body.docs[0];
            vm.UseYNData.Code = vm.data.UseYN;
            vm.data.UserRoles = [];
            var UserRoleIds = [];
            var UserRoleNms = [];
            if (vm.data.UserRoleIds != null) {
              UserRoleIds = vm.data.UserRoleIds.split(",");
            }
            if (vm.data.UserRoleNms != null) {
              UserRoleNms = vm.data.UserRoleNms.split(",");
            }
            angular.forEach(UserRoleIds, function(item, key) {
              var UserRole = {RoleId:item,RoleNm:UserRoleNms[key]};
              vm.data.UserRoles.push(UserRole);
            });

            var uploadFileList = [];

            angular.forEach(vm.data.uploadFileList, function(item) {
              var obj = {
                id : item.fileId,
                isLoaded : true,
                link : StaticVariable.getFileDownloadUrl(item.PhysicalFileNm),
                fileName : item.LogicalFileNm,
                size : item.FileSize,
                fileKey : item.PhysicalFileNm,
                path : item.PhysicalPath,
                downloadCnt : item.DownloadCnt,
              };
              uploadFileList.push(obj);
            });

            angular.copy(uploadFileList, vm.uploadFileList);

            return;
          }
        }
      },
      function(error) {
        console.error("Error> h0102-edit-ctrl> getData()", status, error);
        vm.dataloader = false;
        gAlert("", error.responseVO.body.docs[0].errMessage);
      });
    }

    // 회원사 체크 (회원사가 존재하지 않을시 history.back)
    function getTenantNm() {
      var data = {
        TenantId : vm.tenantId,
        mapCode : 'getTenantNm',
      };

      postApi.login(data,function(result) {
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length > 0) {
            vm.tenantNm = result.body.docs[0].TenantNm;
            vm.joinVisible = true;
          }
          else {
            gAlert('', '회원사코드와 일치하는 회원사가 존재하지 않습니다.', {
              btn : '',
              fn : function() {
                history.back();
              }
            });
          }

          return;
        }
      },
      function(error) {
        console.error("Error> signup-step-two.component.js > getTenantNm()", status, error);
        vm.dataloader = false;
        gAlert("", error.responseVO.body.docs[0].errMessage);
      });
    }

    function goCancel() {
      $state.go("login");
    }

    function salemeetGoCancel() {
      $state.go("salemeet");
    }

    // 함수 선언
    vm.setData = setData;
    vm.chkDupLoginId = chkDupLoginId;
    vm.setEmail = setEmail;
    vm.getColunmList = getColunmList;
    vm.getTenantNm = getTenantNm;

    getTenantNm();
    getColunmList();
  }

  webapp.component("signupStepTwo", {
    transclude: true,
    bindings: {},
    controller: SignupStepTwoController,
    controllerAs: "vc",
    templateUrl: "components/login/signup-step-two.html"
  });

  webapp.component("salemeetSignupStepTwo", {
    transclude: true,
    bindings: {},
    controller: SignupStepTwoController,
    controllerAs: "vc",
    templateUrl: "components/login/salemeet-signup-step-two.html"
  });
})();
