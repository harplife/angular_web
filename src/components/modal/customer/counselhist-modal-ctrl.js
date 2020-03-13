(function () {
  "use strict";
  /**
   * @ngdoc function
   * @name app.customer:counselhist-modal-ctrl
   * @param {object} $window - window object
   * @param {object} $rootScope - rootScope object
   * @param {object} $scope - scope object
   * @param {object} $uibModalInstance - uibModalInstance object
   * @param {object} toModalData - toModalData object
   * @param {object} GLOBAL_CONSTANT - Global Constant
   * @param {object} StaticVariable - StaticVariable Constant
   * @param {object} postApi - postApi Module
   * @param {object} gAlert - gAlert Module
   * @param {object} modalFactory - Modal Popup object
   * @param {object} gConfirm - gConfirm Module
   * @param {object} customFieldApi - customFieldApi Module
   * @param {object} $translate - translate object
   * @param {object} $timeout - timeout object
   * @param {object} $filter - filter object
   * @description Controller of the 고객정보
   */
  webapp.controller('CounselHistModalCtrl', ['$window', '$rootScope', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'StaticVariable', 'postApi', 'gAlert', 'modalFactory', 'gConfirm', 'customFieldApi', '$translate', '$timeout', '$filter',
    function CounselHistModalCtrl($window, $rootScope, $scope, $uibModalInstance, toModalData, CONSTANT, StaticVariable, postApi, gAlert, modalFactory, gConfirm, udcApi, $translate, $timeout, $filter) {

      // #region 상수 정의

      // SQL Mapper Id 정의
      var INSERT_SQL = 'Customer.insertCounselHist';  // 등록 SQL
      var UPDATE_SQL = 'Customer.updateCounselHist';  // 수정 SQL
      var VIEW_SQL = 'Customer.getCounselHistDetail'; // 조회 SQL
      var DELETE_SQL = 'Customer.deleteCounselHist';  // 삭제 SQL
      var UPDATE_ATTACHMENT_SQL = 'Customer.updateCounselHistAttachmet';  // 첨부파일 연결 SQL

      // 관련 테이블 정의
      var KEY_TABLE_NM = 'counselhist'; // 작업 테이블명
      var KEY_COLUMN_NM = 'KeyId'; // Primary Key Column

      // #endregion 상수 정의

      // View Model
      var vm = this;          // View Model
      vm.dataloader = false;  // Progressbar 숨김
      vm.vaultCounsel = null; // 고객관리 첨부파일 컴포넌트

      // 부모 창에서 전달받은 Key값 정의
      vm.custId = toModalData.custId;
      vm.keyId = toModalData.keyId;

      // 조회 데이터 설정
      vm.srchDetail = {};
      vm.columnMap = {};

      vm.srchDetail.uploadFileList = []; // 첨부파일 목록
      vm.srchDetail.IdName = KEY_COLUMN_NM; // Primary Key Column
      vm.srchDetail.selectType = "Edit"; // 사용자정의 컬럼 작업 유형 : List(목록), Detail(조회), Edit(등록/수정)
      vm.srchDetail.keyId = vm.keyId;
      vm.srchDetail.tableNm = KEY_TABLE_NM;

      vm.uploadFileListCounsel = [];  // 상담이력 첨부파일 목록
      vm.showUploader = false; // 파입 업로드 컴포넌트 숨김

      // 등록/수정 표시용 컬럼 목록
      vm.srchDetail.editColumns = {};

      // 조회 데이터
      vm.data = {
        KeyId: vm.keyId, // Primary Key Data
        tableNm: KEY_TABLE_NM                                      // 작업 테이블명
      };

      /**
       * 생성자
       * @param
       * @return
       */
      (function CounselHistModalCtrl() {

      })();


      // #region 첨부파일 Callback
      vm.onFileCallback = {
        onFileUploaded: function (id, result) {
          $scope.$apply(function () {
            angular.forEach(result.body.docs, function (item) {
              var obj = item;
              obj.link = StaticVariable.getUrl(item.tmpLink) + "?fileName=" + item.fileName + "&userkey=" + $rootScope.gVariable.userKey;

              vm.uploadFileListCounsel.push(obj);

            });
          });
        },
        onFileUploadComplete: function (id) {
          // 첨부파일 업로드 이후 저장을 호출해야 함
          $timeout(setData, 1);
        },
        onFileDelete: function (item) {
          // 첨부파일 삭제
          var param = {
            fileId: item.id
          };

          // TODO: 첨부파일 삭제 기능 구현 필요
          postApi.attach(param,
            function (result) {
              // 삭제 성공
              if (result.header.status === CONSTANT.HttpStatus.OK) {
                gAlert("", "Menu.DELETED");
              }
            },
            function (error) {
              // 삭제 실패
              console.error("Error> onFileDelete()");
              console.table(error);
            }
          );


        },
        onLoaded: function (id, vault) {
          // 첨부파일 control 설정
          vm[id] = vault;
        }
      };

      // #endregion 첨부파일 Callback


      /**
       * 저장
       * @param
       * @return
       */
      function ok() {

        var okData = {
          keyId: vm.data.keyId
        };

        $uibModalInstance.close(okData);
      }

      /**
       * 취소
       * @param
       * @return
       */
      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      /**
       * 데이터 조회
       * @param
       * @return
       */
      function getData() {
        vm.dataloader = true; // Progressbar 표시

        // 첨부파일 컴포넌트 초기화
        vm.showUploader = enableUploadComponent();
        initVaultComponent('vaultCounsel', vm.onFileCallback);

        // 초기 데이터 설정
        setInitData();

        if (isNullOrEmpty(vm.keyId)) {
          vm.dataloader = false;  // Progressbar 숨김
        }

        vm.srchDetail.viewColumns = {}; // 조회 컬럼
        var data = vm.srchDetail;

        data.custId = vm.custId;
        data.mapCode = UPDATE_ATTACHMENT_SQL;

        // 첨부파일 연결
        // 신규등록에서 상담>첨부파일 등록시 고객>관련사진으로 연결되므로 상담>첨부파일로 재 연결 처리
        postApi.update(data, function (result) {
          // Do Nothing
        }, function (error) {
          console.error("Error> getData()");
          console.table(error);
          gAlert('', result.responseVO.body.docs[0].errMessage);
        });

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

              // 날짜 데이터 설정
              if (!isNullOrEmpty(vm.data.CounselDt))
                vm.CounselDt = moment(vm.data.CounselDt).toDate();

              // 첨부파일 목록 설정
              var uploadFileListCounsel = [];

              angular.forEach(vm.data.uploadFileList, function (item) {
                var obj = {
                  id: item.fileId,
                  isLoaded: true,
                  link: StaticVariable.getFileDownloadUrl(item.PhysicalFileNm),
                  fileName: item.LogicalFileNm,
                  size: item.FileSize,
                  fileKey: item.PhysicalFileNm,
                  grpId: item.GrpId,
                  path: item.PhysicalPath,
                  downloadCnt: item.DownloadCnt
                };

                vm.uploadFileListCounsel.push(obj);
              });

              //angular.copy(uploadFileList, vm.uploadFileList);
            }
          } else {
            vm.dataloader = false; // Progressbar 숨김

            console.error("Error> getData()");


          }

        }, function (error) {
          console.error("Error> getData()");
          console.table(error);
        });

      }

      /**
       * 초기 데이터 설정
       * @param
       * @return
       */
      function setInitData() {

        // 날짜 컬럼 초기값
        vm.CounselDt = new moment().toDate();

        // 신규 등록
        if (isNullOrEmpty(vm.data.keyId)) {
          // 초기 데이터 설정
        }

      }

      /**
       * 첨부파일 업로드
       * @param
       * @return
       */
      vm.uploadFile = function () {
        if (vm.vault != null && vm.vault.data.getLength() > 0) {
          // 첨부파일 존재시 파일 업로드 후 저장
          uploadVaultFile(vm.vault);
        } else {
          // 데이터 저장
          setData();
        }
      };

      /**
       * 상담 첨부파일 업로드
       * @param
       * @return
       */
      function uploadFileCounsel() {

        // #region 입력값 설정
        // 날짜 데이터 설정
        if (isValidDate(vm.CounselDt))
          vm.data.CounselDt = moment(vm.CounselDt).format('YYYY-MM-DD');
        // #endregion 입력값 설정

        // #region 필수항목 & Validation Check 체크
        if (!getIsValidData()) {
          return;
        }
        // #endregion 필수항목 & Validation Check 체크

        if (vm.vaultCounsel != null && vm.vaultCounsel.data.getLength() > 0) {
          // 첨부파일 존재시 파일 업로드 후 저장
          uploadVaultFile(vm.vaultCounsel);
        } else {
          // 데이터 저장
          setData();
        }
      }

      /**
       * 첨부파일 목록 조회
       *
       * @param
       * @return
       */
      function getUploadFileList() {
        if (isNullOrEmpty(vm.srch.keyId)) {
          return;
        }

        var data = vm.srch;
        data.mapCode = 'FileAttach.getUploadFileList';

        postApi.select(data, function (result) {
          vm.dataloader = false;
          if (result.header.status == CONSTANT.HttpStatus.OK) {
            if (!vm.showUploader) {

              var uploadFileList = [];

              angular.forEach(result.body.docs, function (item) {
                var obj = {
                  id: item.fileId,
                  isLoaded: true,
                  link: StaticVariable.getUrl('/attach/file/' + item.PhysicalFileNm + '/download.do?path=' + item.PhysicalPath + '&fileName=' + item.LogicalFileNm),
                  fileName: item.LogicalFileNm,
                  size: item.FileSize,
                  fileKey: item.PhysicalFileNm,
                  typeId: 'file',
                  path: item.PhysicalPath,
                  downloadCnt: item.DownloadCnt,
                  delState: ''
                };

                uploadFileList.push(obj);
              });

              angular.copy(uploadFileList, vm.uploadFileList);

            }
          }
        }, function (error) {
          console.error("Error> getUploadFileList()");
          console.table(error);
        });
      }

      /**
       * 필수 입력 & Validation Check
       *
       * @param
       * @return
       */
      function getIsValidData() {

        // #region 필수항목 체크
        var errMsg = '';

        if (!vm.CounselDt)
          errMsg = errMsg + '- 상담일을 입력하세요.<br/>';

        if (isNullOrEmpty(vm.data.CounselContents))
          errMsg = errMsg + '- 상담내용을 입력하세요.<br/>';

        if (!isNullOrEmpty(errMsg)) {
          gAlert('', errMsg);
          return false;
        }

        // #endregion 필수항목 체크

        //#region Validation Check

        return true;
        //#endregion Validation Check
      }

      /**
       * 데이터 저장
       *
       * @param
       * @return
       */
      function setData() {

        // #region 필수항목 & Validation Check 체크
        /*  if (!getIsValidData())
            return false;*/
        //#endregion 필수항목 & Validation Check 체크


        // #region 입력값 설정

        // KeyId
        vm.data.keyId = vm.keyId;

        // 고객ID
        vm.data.CustId = vm.custId;

        // #endregion 입력값 설정

        // 내용
        vm.data.tableNm = KEY_TABLE_NM;             // 작업 테이블명
        vm.data.IdName = KEY_COLUMN_NM;             // Primary Key Column
        vm.data.uploadFileList = [];                // 첨부파일

        angular.forEach(vm.uploadFileListCounsel, function (item) {
          vm.data.uploadFileList.push(item);
        });
        vm.data.userkey = $rootScope.gVariable.userkey;          // 사용자 식별 키

        var data = vm.data; // 사용자 입력 데이터
        if (isNullOrEmpty(vm.keyId)) {
          // 신규 등록
          data.mapCode = INSERT_SQL;

          postApi.insert(data, function (result) {
            setInsertUpdateDetail(result);
          }, function (error) {
            console.error("Error> setData()");
            console.table(error);
            gAlert('', error.body.docs[0].errMessage);
          });
        } else {
          // 수정
          data.RelateDataId = vm.keyId;
          data.mapCode = UPDATE_SQL;

          postApi.update(data, function (result) {
            setInsertUpdateDetail(result);
          }, function (error) {
            console.error("Error> setData()");
            console.table(error);
            gAlert('', result.responseVO.body.docs[0].errMessage);
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
                ok();
              }
            });
            return;
          }
        }

        console.error("Error> setInsertUpdateDetail()");
        gAlert('', result.body.docs[0].errMessage);
      }

      // 함수 정의
      vm.setData = setData; // 저장
      vm.uploadFileCounsel = uploadFileCounsel; // 저장

      vm.ok = ok; // 저장
      vm.cancel = cancel; // 취소

      // 데이터 조회
      getData();

    }]);

})();
