/* "use strict"; */
webapp.service('ifProxy',
  ['GLOBAL_CONSTANT', '$compile', 'postApi', '$window', 'gAlert', '$rootScope', '$state', 'StaticVariable', 'LoginAPISrv', '$timeout',
  function ifProxy(CONSTANT, $compile, postApi, $window, gAlert, $rootScope, $state, StaticVariable, loginApi, $timeout) {

    var vm = this;
    vm.userType = $window.sessionStorage['USE_APPTYPE'];

     /**
     * @description 멤버스 로그인
     * @param Object data : Iframe으로 받은 정보값
     * @return void
     */
    vm.membersLogin = function (data) {
      var field = data;
      field.loginId = field.memId;
      field.loginPw = field.memPwd;
      postApi.login('custLogin',field, function(result){
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          //$window.localStorage['M_USER_PWD'] = field.memPwd;
          $window.localStorage['M_USER_ID'] = field.memId;
          $window.localStorage['M_USER_PW'] = field.loginPw;
          $window.localStorage['M_USER_SAVEID'] = field.saveId;
          $window.localStorage['M_USER_TYPE'] = "MEMBER";
          $window.localStorage['M_USER_SAVEAUTOLOGIN'] = field.saveAutoLogin;
          $rootScope.setUserSession(result.body.docs[0]);
          $rootScope.$broadcast('broadcastMobileChangeUserState', {});
          ifProxy.send('startLogin', { passYn: true} );
        } else {
          gAlert('', '로그인에 실패하였습니다. 다시 시도하여주세요.', {
            btn: '확인', fn: function () { }
          });
        }
      });
    };
    /**
     * @description 리더스 로그인
     * @param Object data : Iframe으로 받은 정보값
     * @return void
     */
    vm.Login = function (data) {
      var field = data;
      field.loginId = field.memId;
      field.loginPw = field.memPwd;

      postApi.login('login',field, function(result){
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          //$window.localStorage['M_USER_PWD'] = field.memPwd;
          $window.localStorage['M_USER_ID'] = field.memId;
          $window.localStorage['M_USER_PW'] = field.loginPw;
          $window.localStorage['M_USER_SAVEID'] = field.saveId;
          $window.localStorage['M_USER_TYPE'] = "MASTER";
          $window.localStorage['M_USER_SAVEAUTOLOGIN'] = field.saveAutoLogin;
          $rootScope.setUserSession(result.body.docs[0]);
          $rootScope.$broadcast('broadcastMobileChangeUserState', {});
          ifProxy.send('startLogin', { passYn: true} );
        } else {

          if(result.body.docs.length > 0 && result.body.docs[0].checkApproval == "N") {
            gAlert('', result.body.docs[0].MSG, {
              btn: '확인', fn: function () { }
            });
          } else {
            gAlert('', '로그인에 실패하였습니다. 다시 시도하여주세요.', {
              btn: '확인', fn: function () { }
            });
          }
        }
      });
    };


    var ifProxy = null;
    var regEvent = true;
    ifProxy = {
      instance : this,
      responselistner : null,
      porthole : null,
      $frame : null,
      $fromRequestKey : null,
      orgTargetRequestKey : null,
      getIfProxyReqKey : null,
      reset : function () {

      },
      init : function(option){
        //$window.sessionStorage["M_LAST_PAGE"] = $state.current.name;
        this.porthole = new Porthole.WindowProxy(SHOP_DOMAIN_ADDRESSS, option.targetId);

        $frame = $("#" + option.targetId);
        $frame.attr("ng-src", option.url);
        var offset = $("#page-wrapper [ui-view]").offset();
        $frame.css("height", $(window).height() - offset.top );
        $frame.css("display", "block");
        $compile($frame)(option.scope);

        var callback = option.callback;

        if(regEvent) {
          this.porthole.addEventListener(this.reqeuest);
          regEvent = false;
        }

        if(callback.completInit != null)
          callback.completInit(this.porthole);

        if(callback.contentChangeSuccess != null)
          ifProxy.porthole.Callback_contentChangeSuccess = callback.contentChangeSuccess;

        if(callback.onMessage != null)
          ifProxy.porthole.Callback_onMessage = callback.onMessage;
      },

      reqeuest :  function(msg) {
        if (SHOP_DOMAIN_ADDRESSS.replace("https","").replace("http","") == msg.origin.replace("https","").replace("http","")) {
          ifProxy.orgTargetRequestKey = msg.data.data.requestKey;
          var action = msg.data.action;
          var sData = msg.data.data;
          if(action == "redirctLoginPage") {
            StaticVariable.sessionExpire();
            var prms = loginApi.doLogout().post().$promise;
            prms.then(function(json) {
              var temp = {};
              temp.layoutBoard = "N";
              temp.USE_APPTYPE = $window.sessionStorage["USE_APPTYPE"];
              $window.sessionStorage.clear();
              $window.localStorage.clear();
              gAlert('', '접속 정보가 변경되어 재로그인이 필요합니다.', {
                btn : '',
                fn : function() {
                  $window.sessionStorage["layoutBoard"] = temp.layoutBoard;
                  $window.sessionStorage["USE_APPTYPE"] = temp.USE_APPTYPE;
                  vm.showTopBtn = true;
                  $rootScope.$broadcast('broadcastMobileChangeUserState', {});

                  $state.go("m.member.login");
                }
              });
            }, function(error) {
              console.error('fail', status);
            });
          }

          if(action == "setNavi" && sData.title == "회원로그인" && $window.loginUserIdx != undefined) {
            StaticVariable.sessionExpire();
            var prms = loginApi.doLogout().post().$promise;
            prms.then(function(json) {
              var temp = {};
              temp.layoutBoard = "N";
              temp.USE_APPTYPE = $window.sessionStorage["USE_APPTYPE"];
              $window.sessionStorage.clear();
              $window.localStorage.clear();
              gAlert('', '접속 정보가 변경되어 재로그인이 필요합니다.', {
                btn : '',
                fn : function() {
                  $window.sessionStorage["layoutBoard"] = temp.layoutBoard;
                  $window.sessionStorage["USE_APPTYPE"] = temp.USE_APPTYPE;
                  vm.showTopBtn = true;
                  $rootScope.$broadcast('broadcastMobileChangeUserState', {});
                }
              });
            }, function(error) {
              console.error('fail', status);
            });
          }

          if(action == "startLogin") {
            M.fcm.getFcmToken({
              onSucess:function(token){
                msg.data.data.osType = getOs();
                msg.data.data.fcmToken = token;
                if(vm.userType == "members") {
                  vm.membersLogin(msg.data.data);
                } else {
                  vm.Login(msg.data.data);
                }
              }
            });
            return;
          }

          if(action == "findUserId" || action == "findUserPw") {
            var request = sData;
            request.mapCode = 'checkFindUserInfo';
            request.action = action;
            request.userType = vm.userType;
            postApi.openApi(request, function (result) {
              if (result.header.status === CONSTANT.HttpStatus.OK) {
                console.log(result);
                var req = {};
                if(result.body.docs.length == 0) {
                  req.passYn = false;
                  gAlert('', '해당 정보를 찾을 수 없습니다.', {
                    btn: '확인', fn: function () { }
                  });
                } else {
                  req.passYn = true;
                }
                ifProxy.send(action, req);
              }
            });
            return;
          }

          if(action == "goDashboard") {
            $state.go("m.dashboard");
          }

          if(ifProxy.porthole.Callback_contentChangeSuccess != null && action == 'frameContentChangeSuccess') {
            if($window.sessionStorage["M_LAST_PAGE"] != $state.current.name) {
              ifProxy.porthole.Callback_contentChangeSuccess(sData);
              $window.sessionStorage["M_LAST_PAGE"] = $state.current.name;
            } else {

            }
            return;
          }

          var data = msg.data;
          if(data.useAuth) {

          } else {
            var response = {
              action : action,
              requestKey : data.requestKey,
              data : data.data
            };
            delete response.data.action;
            delete response.data.useAuth;
            ifProxy.porthole.Callback_onMessage(response);
          }
        } else {

        }
      },

      send : function (action, data) {
        if(data == null) data = {};
        if(data != null) {
          data.requestKey = '';
			    data.useAuth = false;
          this.porthole.post({action: action, data : data, useAuth : false});
        } else {
          var data = {};
          data.requestKey = '';
			    data.useAuth = false;
          this.porthole.post({action: action});
        }
      },

      page : function(data) {
        var thisTemp = this;
        var param = {};
        param.requestKey = ifProxy.orgTargetRequestKey;
        var porthole = this.porthole;
        postApi.openApi('getRequestKey',param, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            var action = "goPages";
            data.useAuth = true;
            data.fromKey = param.requestKey;
            data.requestKey = result.body.docs[0].requestKey;
            data.userKey = result.body.docs[0].userKey;
            //porthole.post({action: action, data : data, useAuth : true});
            //alert(JSON.stringify(data))
            thisTemp.overrideSender(action, data);
          } else {
            console.error(result);
          }
        });
      },

      overrideSender : function(action, data) {
        //$timeout(
          try {

          this.porthole.post({action: action, data : data, useAuth : true})
        } catch (e) {
          console.log(e)
          $window.sessionStorage["M_LAST_PAGE"] = "";
          $state.reload($state.current.name);
        }
          //, 500);
          //this.porthole.post({action: action, data : data, useAuth : true});
        //}, 1000)

      },

      authApi : function(actionKey, data) {
        var param = {};
        param.requestKey = ifProxy.orgTargetRequestKey;
        var porthole = this.porthole;
        postApi.openApi('getRequestKey',param, function(result){
          if (result.header.status === CONSTANT.HttpStatus.OK) {
            var action = "authApi";
            data.useAuth = true;
            data.actionKey = actionKey;
            data.fromKey = ifProxy.orgTargetRequestKey;
            data.requestKey = result.body.docs[0].requestKey;
            data.userKey = result.body.docs[0].userKey;

            porthole.post({action: action, data : data, useAuth : true});

          } else {
            console.error(result);
          }
        });
      }
    };
    return ifProxy;
  },
]);
