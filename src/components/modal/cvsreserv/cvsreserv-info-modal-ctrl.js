webapp.controller('CvsReservInfoModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'ModalAPISrv', 'postApi', 'gAlert', '$rootScope', 'modalFactory', 'gConfirm', '$filter',
    function CvsReservInfoModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, modalApi, postApi, gAlert, $rootScope, modalFactory, gConfirm, $filter ) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.CustId = toModalData.custId;
      vm.keyId = toModalData.keyId;
      vm.type = toModalData.type;
      vm.MobileYn = toModalData.MobileYn;
      if(toModalData.MobileYn == undefined) vm.MobileYn = false;

      //function
      vm.setData = setData;
      vm.getData = getData;

      var VIEW_SQL = 'CvsReserv.getReservDetail'; // 조회 SQL
      var UPDATE_SQL = 'CvsReserv.updateReserv';     // 수정 SQL
      var INSERT_SQL = 'CvsReserv.insertReserv';     // 수정 SQL
      var DEL_SQL = 'CvsReserv.deleteReserv';     // 수정 SQL
      var CUSTMER_SQL = 'CvsReserv.getReservCustomer'; // 고객정보 SQL
      // 관련 테이블 정의
      var KEY_TABLE_NM = 'cvsreservhist'; // 작업 테이블명
      var KEY_COLUMN_NM = 'KeyId'; // Primary Key Column


      var RES_TYPE_DEL = 'D';
      var RES_TYPE_EDIT = 'E';
      var RES_TYPE_ADD = 'A';

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

      // 예약시간 - 분
      vm.ReservMinCodeList = ['00','10','20','30','40','50'];

      (function CvsReservInfoModalCtrl() {

      })();

      function ok() {
        var title = vm.data.ReservHour +':'+vm.data.ReservMin+'/'+vm.data.CustNm+'/';

        if (!isNullOrEmpty(vm.data.CareTktNm)) {
          title = title + vm.data.CareTktNm+'/';
        }
        if (!isNullOrEmpty(vm.data.MngCnt)) {
          title = title + vm.data.MngCnt+'회차/';
        }
        title = title + vm.data.ManagerNm;

        var okData = {
          res : vm.res,
          reservDate : vm.data.ReservDate,
          keyId : vm.data.keyId,
          title : title
        }
        $uibModalInstance.close(okData);
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

        vm.srchDetail.viewColumns = {};

        if(vm.type ==='add') { // 추가인 경우

          var data = vm.srchDetail;
          data.CustId = vm.CustId;
          data.mapCode = CUSTMER_SQL;

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


              } else {
                vm.data = {
                  CustId : '',
                  CustNm : '',
                  Manager : '',
                  ManagerNm : ''
                }
              }
              // 추가시 고객정보 유무를 제외한 초기 셋팅값
              vm.data.keyId = '';
              vm.chkDate = moment(toModalData.chkDate).toDate();

              vm.data.ReservDate = moment(vm.chkDate).format('YYYY-MM-DD');
              vm.data.ReservReason = '';
              vm.data.CareTktId = '';
              vm.data.CareTktNm = '';

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

        } else if(vm.type === 'edit') { // edit인 경우 데이터 조회
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
                vm.chkDate = moment(vm.data.ReservDate).toDate();
                vm.data.ReservHour = moment(vm.data.ReservDate).format('HH');
                vm.data.ReservMin = moment(vm.data.ReservDate).format('mm');
                vm.data.ReservDate = moment(vm.chkDate).format('YYYY-MM-DD');
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
        if (isNullOrEmpty(vm.data.CustNm)) {
          errMsg = errMsg + '- 고객명을 선택하세요.<br/>';
        }
        if (isNullOrEmpty(vm.data.ManagerNm)) {
          errMsg = errMsg + '- 관리사를 선택하세요.<br/>';
        }
        if (isNullOrEmpty(vm.data.ReservDate)) {
          errMsg = errMsg + '- 예약일자를 선택하세요.<br/>';
        }
        if (isNullOrEmpty(vm.data.ReservHour) || isNullOrEmpty(vm.data.ReservMin)) {
          errMsg = errMsg + '- 예약시간을 선택하세요.<br/>';
        }
        if (isNullOrEmpty(vm.data.ReservReason)) {
          errMsg = errMsg + '- 예약사유를 선택하세요.<br/>';
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
        var data = angular.copy(vm.data); // 사용자 입력 데이터
        var tmpDate = moment(vm.data.ReservDate+' '+vm.data.ReservHour+':'+vm.data.ReservMin+':00').toDate();
        data.ReservDate = $filter('localToUtc')(tmpDate);
        // 수정

        console.log(data.ReservDate);

        if(vm.type ==='add') {
          data.mapCode = INSERT_SQL;
          vm.res = RES_TYPE_ADD;

          postApi.insert(data, function (result) {
            setInsertUpdateDetail(result);
          } ,function (error) {
            console.error("Error> setData()");
            console.table(error);
          });

        } else if(vm.type ==='edit') {

          data.mapCode = UPDATE_SQL;
          data.RelateDataId = data.keyId;
          vm.res = RES_TYPE_EDIT;

          postApi.update(data, function (result) {
            setInsertUpdateDetail(result);
          } ,function (error) {
            console.error("Error> setData()");
            gAlert('', 'Menu.EXCEPTIONOCCURED');
          });

        }
      }

      /**
       * 데이터 저장 후 처리
       *
       * @param result - 저장 결과
       * @return
       */
      function setInsertUpdateDetail(result) {
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          if (
            result.body.docs[0].KeyId !== null ||
            result.body.docs[0].NewKeyId !== null
          ) {
            // KeyId 조회
            vm.data.keyId = !isNullOrEmpty(result.body.docs[0].NewKeyId) ? result.body.docs[0].NewKeyId : result.body.docs[0].KeyId;

            if(isNullOrEmpty(vm.data.keyId)) {
              vm.data.keyId = result.body.docs[0].RelateDataId != null ? result.body.docs[0].RelateDataId : '';
            }
            gAlert("", "Menu.SAVED", {
              btn: "",
              fn: function () {
                sendSMS();
              }
            });
            return;
          }
        }

        console.error("Error> setInsertUpdateDetail()");
        gAlert('', result.body.docs[0].errMessage);
      }

      function sendSMS() {

        var data = angular.copy(vm.data);

        data.UserId = data.Manager;
        data.SendMessage = vm.data.ReservDate+" "+vm.data.ReservHour +':'+vm.data.ReservMin+" "+vm.data.CustNm+"님 예약되었습니다.";
        data.mapCode = "Campaign.insertReservSMSHist";

        postApi.insert(data, function (result) {
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            ok();
          }
        } ,function (error) {
          console.error("Error> setData()");
          console.table(error);
        });
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

        vm.data.tableNm = KEY_TABLE_NM;

        var data = vm.data;
        data.mapCode = DEL_SQL;

        postApi.update(data, function (result) {
          if (result.header.status == CONSTANT.HttpStatus.OK) {
            gAlert('', 'Menu.DELETED', {
              btn: '',
              fn: function () {
                // 삭제 성공
                vm.res = RES_TYPE_DEL;
                ok();
              }
            });

          }
        }, function (error) {
          // 삭제 중 오류 발생
          console.error("Error> delDataAction()");
          console.table(error);
        });
      }

      // #region 사용자 팝업 호출

      /**
       * 사용자 팝업 호출
       *
       * @param {string}
       * @return {boolean}
       */

      function srchUserModal () {
        var ctrl = 'UserModalCtrl as modalCtrl';
        var paramData = { srchTenantId : $rootScope.gVariable.srchTenantId, MobileYn : vm.MobileYn };
        var modalInstance = modalFactory.open('lg', 'components/modal/users/user-modal.html', ctrl, paramData);
        modalInstance.result.then(function(res) {
          vm.data.ManagerNm = res.UserNm;
          vm.data.Manager = res.UserId;
        }, function(cancelData) {
        });
      };

      /* 사용자검색- 지우기 */
      function eraseUser() {
        vm.data.ManagerNm = '';
        vm.data.Manager = '';
      }

      // #region 고객 팝업 호출

      /**
       * 고객 팝업 호출
       *
       * @param {string}
       * @return {boolean}
       */

      function srchCustomerModal () {
        var ctrl = 'CustomerModalCtrl as modalCtrl';
        var paramData = { srchTenantId : $rootScope.gVariable.srchTenantId };

        var modalInstance = modalFactory.open('lg', 'components/modal/customer/customer-modal.html', ctrl, paramData);
        modalInstance.result.then(function(res) {
          vm.data.CustNm = res.CustNm;
          vm.data.CustId = res.CustId;
        }, function(cancelData) {
        });
      };

      /* 고객검색- 지우기 */
      function eraseCustomer() {
        vm.data.CustNm = '';
        vm.data.CustId = '';
      }

      // #region 고객 팝업 호출

      /**
       * 관리권 팝업 호출
       *
       * @param {string}
       * @return {boolean}
       */

      function srchCareTktModal () {
        var ctrl = 'CareTktModalCtrl as modalCtrl';
        var paramData = { srchTenantId : $rootScope.gVariable.srchTenantId };

        var modalInstance = modalFactory.open('md', 'components/modal/careTkt/care-tkt-modal.html', ctrl, paramData);
        modalInstance.result.then(function(res) {

          vm.data.CareTktNm = res.CareTktNm;
          vm.data.CareTktId = res.KeyId;
          vm.data.TotMngCnt = res.MngCnt;

        }, function(cancelData) {
        });
      };

      /* 관리권검색- 지우기 */
      function eraseCareTkt() {
        vm.data.CareTktNm = '';
        vm.data.CareTktId = '';
        vm.data.TotMngCnt = '';
      }

      getData();

      //함수 호출
      vm.srchUserModal = srchUserModal;
      vm.eraseUser = eraseUser;
      vm.srchCustomerModal = srchCustomerModal;
      vm.eraseCustomer = eraseCustomer;
      vm.srchCareTktModal = srchCareTktModal;
      vm.eraseCareTkt = eraseCareTkt;
      vm.setDelData = setDelData;
    } ]);
