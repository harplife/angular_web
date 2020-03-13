webapp.controller('SurveyModalCtrl', [ '$window', '$scope', '$uibModalInstance', 'toModalData', 'GLOBAL_CONSTANT', 'postApi',
    function SurveyModalCtrl($window, $scope, $uibModalInstance, toModalData, CONSTANT, postApi) {
      var vm = this;
      vm.cancel = cancel;
      vm.ok = ok;
      vm.getList = getList;
      vm.currentPage = 1;
      vm.maxSize = 10;

      vm.columnMap = {};

      var KEY_TABLE_NM = 'surveymodal'; // 작업 테이블명

      vm.srch = {
		    SvyNm : '',
        SvyId : '',
        viewSize : 10,
        tableNm : KEY_TABLE_NM,
      };


      vm.selectedTenantId = toModalData.TenantId;

      (function TenantModalCtrl() {
        getList();
      })();

      function getList() {
        getCnt();
        var data = {
          mapCode: 'Survey.getSurveyList',
          SvyNm : vm.srch.SvyNm,
          userkey : '',
          page : vm.srch.page,
          selectType : 'List',
          tableNm : KEY_TABLE_NM,
        };

        data.mapCode= 'Survey.getSurveyList';
        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            // MetaColumn 사용
            if (result.body.desc.length > 0) {
              // MetaColumn 정보를 이용하여 표시할 목록 정보 설정
              vm.listColumns = result.body.desc;
              angular.forEach(vm.listColumns, function (item) {
                vm.columnMap[item.ColumnPhysicalNm] = item;
              });
            } else {
              console.error('Error> getList()> MetaColumn 정보 조회 오류');
              console.table(data);
            }

            if (result.body.docs.length > 0 && !isNullOrEmpty(vm.listColumns)) {
              // 목록 데이터 표시

            vm.svyLists = result.body.docs;
              // 목록 화면 구성
            } else {
              // 데이터 조회 실패
              vm.svyLists = {};
            }

          }
        });
      }

      function getCnt() {
        var data = {
          mapCode: 'Survey.getSurveyListCnt',
          SvyNm : vm.srch.SvyNm,
          userkey : '',
        };

        data.mapCode= 'Survey.getSurveyListCnt';
        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            vm.totalItems = result.body.docs;
          }
        });
      }


      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      function ok(item) {
        $uibModalInstance.close(item);
      }

      function pageChanged() {
        vm.srch.page = vm.currentPage;
        getList();

      }

      vm.pageChanged = pageChanged;
    } ]);
