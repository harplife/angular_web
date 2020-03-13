webapp.controller('HeaderCtrl', [ '$window', '$rootScope', '$scope', '$state', '$cookieStore', 'gAlert', 'GLOBAL_CONSTANT', 'LoginAPISrv', 'StaticVariable', 'modalFactory','$location', '$stateParams',
    function HeaderCtrl($window, $rootScope, $scope, $state, $cookieStore, gAlert, CONSTANT, loginApi, StaticVariable, modalFactory,$location,$stateParams) {

      var vm = this;
      vm.user = {}
      vm.privateModal = privateModal;
      var saveId = $cookieStore.get('mySavedId');

      if (saveId != undefined && saveId != '') {
        vm.user = {
          DeviceId : saveId,
          saveId : '1',
        };
      }

      $scope.init = function() {
        $rootScope.changeLanguage($window.sessionStorage['currentLanguage']);
      };

      vm.user.userGbn = 'C';
      vm.user.Tenant = 'logo_salevis';

      vm.doLogout = doLogout;

      vm.urlcheck = urlcheck;

      function urlcheck(url){
        console.log(url);
        location.href="/#/"+$stateParams.lang+"/home/"+url;
      }

      function doLogout() {
        /*
         * if(vm.user.DeviceId == undefined || vm.user.DeviceId == "" ){
         * gAlert('', '아이디를 입력하세요.'); return; } if(vm.user.loginPw == undefined ||
         * vm.user.loginPw == "" ){ gAlert('', '비밀번호를 입력하세요.'); return; }
         */
        StaticVariable.sessionExpire();

        var prms = loginApi.doLogout().post().$promise;

        prms.then(
          function(json) {
            gAlert('', 'Menu.SIGNEDOUT', {
              btn : '',
              fn : function() {
                $window.location.replace('/d/');
                //$state.reload('main.login');
                //$state.go('main.login');
              }
            });
          }, function(error) {
            console.error('fail', status);
          });
      }

      function privateModal() {
        var ctrl = 'Private2ModalCtrl as modalCtrl';
        var paramData = {view: 'Y'};
        var modalInstance = modalFactory.open('lg', 'views/modal/private2-modal.html', ctrl, paramData);

        modalInstance.result.then(function(res) {
          //없음
        }, function(cancelData) {
          //없음
        });

      }
      //다국어 언어변환
      vm.changefn = changefn;
      function changefn(key) {
        console.log("changefn:" + key);
        if(key =='en') {
          $('.mainOn').text('ENG');
          var oldpath = $location.path();
          console.log(oldpath);
          $window.location.href = '/#/'+key+oldpath.substr(3,oldpath.langth);
        }else if(key =='ko') {
          $('.mainOn').text('KOR');
          var oldpath = $location.path();
          $window.location.href = '/#/'+key+oldpath.substr(3,oldpath.langth);
        }else if(key =='de') {
          $('.mainOn').text('DEU');
          var oldpath = $location.path();
          $window.location.href = '/#/'+key+oldpath.substr(3,oldpath.langth);
        }else if(key =='ru') {
          $('.mainOn').text('RUS');
          var oldpath = $location.path();
          $window.location.href = '/#/'+key+oldpath.substr(3,oldpath.langth);
        }

      }

      vm.getCurrentLanguage = function() {
        if ($rootScope.currentLanguage == 'ko') {
          return 'KOR';
        } else if($rootScope.currentLanguage == 'en') {
          return 'ENG';
        } else if($rootScope.currentLanguage == 'de') {
          return 'DEU';
        } else if($rootScope.currentLanguage == 'ru') {
          return 'RUS';
        } else {
          return 'ENG';
        }
      }

    } ]);
