/**
 * static-variable-factory.js는 ng-app 전역적인 변수값을 정의하여 사용할 수 있는 정적 메소드이다.
 */

webapp.factory('StaticVariable', [
    '$state',
    '$window',
    '$cookies',
    '$filter',
    '$rootScope',
    'gAlert',
    'GLOBAL_CONSTANT',
    function($state, $window, $cookies, $filter, $rootScope, gAlert, CONSTANT) {
      // -- ACCESS_DENIED("ACN1N00-403") 홈으로 이동
      // -- ALREADY_LOGGED_IN("ACN0N04-409") 로그인에서만 사용
      // -- ACCESS_TOKEN_IS_NULL("ACN0N01-401") 로그인으로 이동
      // -- INVALID_TOKEN("ACN1N01-401") 로그인으로 이동
      // -- TOKEN_IS_EXPIRED("ACN1N02-401") 로그인으로 이동
      // -- DOES_NOT_MATCH_TOKEN_VERSION("ACN1N03-401") 로그인으로 이동
      // -- LOGEDIN_ANOTHER_CLIENT("ACN1N04-401") 로그인으로 이동
      function getContextPath() {
        var offset=location.href.indexOf(location.host)+location.host.length;
        if (offset + 1 >= location.href.length)
          return "";

        var ctxPath=location.href.substring(offset+1,location.href.indexOf('/',offset+1));

        if (ctxPath == '#')
          ctxPath = '';

        return ctxPath;
      }

      CONSTANT.URL.CONTEXT = getContextPath();
      var translate = $filter('translate');

      var alreadyOccurError = false;
      var serverDead = false;

      var intercept = {
        response : function(JSON) {
          //console.info('intercept JSON=====', JSON);
          return JSON.data;
        },
        responseError : function(error) {
          console.log('intercept error=====', error);

          if (error.data == null) {
            gAlert(translate('Menu.SERVERERROR4'), "Unknown error.");
            return null;
          }

          if ((error.status == -1 || error.status == 400) && !serverDead) {
            serverDead = true;
            gAlert(translate('Menu.SERVERERROR1'), {
              fn : function() {
                sessionExpire();
                $state.go('login');
              }
            });

          } else if (error.data && angular.isUndefined(error.data.response)) {
            gAlert(translate('Menu.SERVERERROR2'), error.statusText, {
              fn : function() {
                console.error('server Error', '[' + error.status + ']' + error.statusText);
                if (error.status == 401 || error.status == 400) {
                  sessionExpire();
                  $state.go('login');
                }
              }
            });
            return null;
          } else if (error.data.response.body.docs.errCode == 'ACN0N01-401' || error.data.response.body.docs.errCode == 'ACN1N01-401'
              || error.data.response.body.docs.errCode == 'ACN1N02-401' || error.data.response.body.docs.errCode == 'ACN1N03-401'
              || error.data.response.body.docs.errCode == 'ACN1N04-401') {

            if ($window.sessionStorage.isLoggedIn) {
              alreadyOccurError = true;
              sessionExpire();
              $state.go('login');
              return null;
            }
          } else if (error.data.response.body.docs.errCode === 'ACN1N00-403') {
            console.log(error.data);
            gAlert(translate('Menu.SERVERERROR3'), error.data.response.body.docs.errMessage, {
              fn : function() {
                console.error(error.data.response.body.docs.errMessage);
                $state.go('login');
              }
            });
            return null;
          } else {
            return error.data;
          }

          gAlert(translate('Menu.SERVERERROR4'), error.data.response.body.docs.errMessage);
          console.error(error.data.response.body.docs.errCode, error.data.response.body.docs.errMessage);
        }
      };
      function sessionExpire() {
        $window.sessionStorage.removeItem('isLoggedIn');
        $window.sessionStorage.removeItem('loginUserId');
        $window.sessionStorage.removeItem('loginUserIdx');
        $window.sessionStorage.removeItem('loginSysAdminYN');
        $window.sessionStorage.removeItem('loginUserName');
        $window.sessionStorage.removeItem('loginUserGbn');
        $window.sessionStorage.removeItem('loginUserDept');
        $window.sessionStorage.removeItem('loginUserDeptCode');
        $window.sessionStorage.removeItem('loginComGbn');
        $window.sessionStorage.removeItem('loginUserType');
        $window.sessionStorage.removeItem('loginUserEmail');
        $window.sessionStorage.removeItem('loginTenantId');
        $window.sessionStorage.removeItem('loginTenantName');
        $window.sessionStorage.removeItem('loginTenantDir');
        $window.sessionStorage.removeItem('loginEmail');
        $window.sessionStorage.removeItem('loginTelNo');
        $window.sessionStorage.removeItem('srchTenantId');
        $window.sessionStorage.removeItem('srchTenantName');
      }
      return {
        getUrl : function(uri) {
          var domainPort = CONSTANT.URL.PORT == null || CONSTANT.URL.PORT == "" ? "" : ":" + CONSTANT.URL.PORT;
          var domainContext = CONSTANT.URL.CONTEXT == null || CONSTANT.URL.CONTEXT == "" ? "" : '/' + CONSTANT.URL.CONTEXT;
          var domainVersion = CONSTANT.URL.VERSION == null || CONSTANT.URL.VERSION == "" ? "" : '/' + CONSTANT.URL.VERSION;

          var url = CONSTANT.URL.HTTP_PROTOCOL + '//' +
          CONSTANT.URL.API_SERVER_DOMAIN + domainPort + domainContext +
          domainVersion + uri;
          //var url = domainContext + domainVersion + uri;
          return url;
        },
        getFileDownloadUrl : function(FileKey) {
          return this.getUrl('/attach/file/' + FileKey + '/download.do?userkey=' + $rootScope.gVariable.userKey);
        },
        getDateFormat : function(langCode, useDateTime) {
          var foramt;
          switch (langCode) {
          case 'ko':
            format = 'yyyy.MM.dd';
            break;
          case 'zh':
            // break;
          case 'ja':
            format = 'yyyy.MM.dd';
            break;
          case 'en':
            format = 'MM/dd/yy';
            break;
          default:
            format = 'MM/dd/yy';
            break;
          }
          return useDateTime ? format + ' HH:mm:ss' : format;
        },
        sessionExpire : function() {
          sessionExpire();
        },
        getRequestActions : {
          defaultAction : function() {
            return {
              one : {
                method : 'GET',
                interceptor : intercept,
                transformResponse : function(data, headersGetter) {
                  var contentType = headersGetter('Content-Type');
                  if (contentType && contentType.indexOf('text/html') > -1) {
                    return {
                      'body' : data
                    };
                  }
                  return angular.fromJson(data);
                }
              },
              post : {
                method : "POST",
                interceptor : intercept
              },
              get : {
                method : "GET",
                interceptor : intercept
              },
            };
          },
          getStandardAction : function() {
            return {
              getOne : {
                method : 'GET',
                headers : {
                  'Content-Type' : 'application/json'
                },
                interceptor : intercept,
              },
              getList : {
                method : "GET",
                headers : {
                  'Content-Type' : 'application/json'
                },
                interceptor : intercept,
              },
              create : {
                method : "POST",
                headers : {
                  'Content-Type' : 'application/json'
                },
                interceptor : intercept,
              },
              modify : {
                method : "PUT",
                headers : {
                  'Content-Type' : 'application/json'
                },
                interceptor : intercept,
              },
              remove : {
                method : "DELETE",
                headers : {
                  'Content-Type' : 'application/json'
                },
                interceptor : intercept,
              },
            };
          },
        }
      };
    } ]);
