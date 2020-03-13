webapp.controller('ProductSearchCtrl', [ '$window', '$scope', '$location', '$state', '$stateParams', '$rootScope', 'GLOBAL_CONSTANT', 'modalFactory', 'ProductAPISrv', 'gAlert', 'gConfirm','$http',
    function ProductSearchCtrl($window, $scope, $location, $state, $stateParams, $rootScope, CONSTANT, modalFactory, api, gAlert, gConfirm, $http) {
	    var vc = this;

      // 검색 데이터
      vc.srch = {
        BlcSn : $stateParams.BlcSn == undefined ? 0 : $stateParams.BlcSn,
        SearchKey : $stateParams.SearchKey  == undefined ? '' :  $stateParams.SearchKey,
        LgrpCd : 'PRODUCT',
        AdminYn : 'N',
        viewSize : '0',
        lang : $stateParams.lang,
      };
      //페이지별 정보 목록
      vc.list = null;
      vc.searchList = {
          'PRODUCTS01'  : [],
          'PRODUCTS02'  : [],
          'PRODUCTS03'  : [],
          'PRODUCTS04'  : [],
          'PRODUCTS05'  : [],
          'PRODUCTS06'  : [],
      };

      function reset(){
        vc.list = null;
        vc.searchList = {
            'PRODUCTS01'  : [],
            'PRODUCTS02'  : [],
            'PRODUCTS03'  : [],
            'PRODUCTS04'  : [],
            'PRODUCTS05'  : [],
            'PRODUCTS06'  : [],
        };
      }

      // 목록 조회
      vc.getList = getList;
      function getList() {
        if(vc.srch.SearchKey){
          reset();
          var prms = api.doList().post(vc.srch).$promise;
          prms.then(function(data) {
            if (data.responseVO.header.status === CONSTANT.HttpStatus.OK) {
              if (data.responseVO.body.docs.length > 0) {
                vc.list = data.responseVO.body.docs;
                for(var i = 0; i < vc.list.length; i++){
                  if(vc.list[i].SgrpCd == 'PRODUCTS01'){
                    vc.searchList.PRODUCTS01.push(vc.list[i]);
                  }else if(vc.list[i].SgrpCd == 'PRODUCTS02'){
                    vc.searchList.PRODUCTS02.push(vc.list[i]);
                  }else if(vc.list[i].SgrpCd == 'PRODUCTS03'){
                    vc.searchList.PRODUCTS03.push(vc.list[i]);
                  }else if(vc.list[i].SgrpCd == 'PRODUCTS04'){
                    vc.searchList.PRODUCTS04.push(vc.list[i]);
                  }else if(vc.list[i].SgrpCd == 'PRODUCTS05'){
                    vc.searchList.PRODUCTS05.push(vc.list[i]);
                  }else if(vc.list[i].SgrpCd == 'PRODUCTS06'){
                    vc.searchList.PRODUCTS06.push(vc.list[i]);
                  }
                }
              }
            }
          }, function(error) {
            console.error('Error-getList', status, data);
          });
        }
      }

      vc.SgrpCdType = SgrpCdType;
      function SgrpCdType(type){
        if (type == 'PRODUCTS03')
          return 'products-mobilecomputers';
        else if (type == 'PRODUCTS04')
          return 'products-ruggedsmartphone';
        else if (type == 'PRODUCTS02')
          return 'products-handheldterminal';
        else if (type == 'PRODUCTS06')
          return 'products-rfidsolution';
        else if (type == 'PRODUCTS01')
          return 'products-bluetoothscanner';
        else if (type == 'PRODUCTS05')
          return 'products-pos';

        return 'products-mobilecomputers';
     }

      vc.doSearch = doSearch;
      function doSearch(){
        if(vc.srch.SearchKey.length > 1){
          location.href="/#/"+$rootScope.currentLanguage+"/home/search-result/" + vc.srch.SearchKey;
        }else{
          alert('Please enter at least two characters for your search.');
        }
      }

      /************************************************************************************
       * 페이지 로딩시 실행하는 함수 정리
       ************************************************************************************/
      function pageLoad() {
        getList();
      }

      pageLoad();
    }, ]);
