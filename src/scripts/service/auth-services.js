angular.module('AuthServices', [ 'ngResource' ]).factory('Auth', function($resource, $rootScope, $window) {

  var auth = {};
  //auth.permissions = {'app.system.user-list':true,'app.system.department-list':false};
  auth.permissions = null;

  auth.init = function(perm) {
    auth.permissions = {};

    angular.forEach(perm, function(item) {
      auth.permissions[item.PageUrl] = item;
    });

    $window.sessionStorage.setItem("authPer", angular.toJson(auth.permissions))
  };

  auth.checkPermissionForView = function(view) {
    if (auth.permissions == null) {
      auth.permissions = angular.fromJson($window.sessionStorage.getItem("authPer"));
    }

    if (!view.requiresAuthentication) {
      return true;
    }

    return userHasPermissionForView(view);
  };

  var userHasPermissionForView = function(view) {
    if (!auth.isLoggedIn()) {
      return false;
    }

    return auth.userHasPermission(view.name);
  };

  auth.userHasPermission = function(viewName) {
    if (!auth.isLoggedIn()) {
      return false;
    }

    //console.log('2 permissions=', auth.permissions);
    //console.log('auth.permissions[viewName]=', auth.permissions[viewName]);

    if (auth.permissions == null) {
      auth.permissions = angular.fromJson($window.sessionStorage.getItem("authPer"));
    }

    if (auth.permissions == null) {
      return false;
    }

    if (viewName.indexOf(':') == -1) {
      if (auth.permissions[viewName] == null) {
        //console.log('auth.permissions viewName null');
        //return false;
        return true;
      }

      if (auth.permissions[viewName]['read'] == 'Y') {
        return true;
      }
    } else {
      var view = viewName.split(':')[0];
      var button = viewName.split(':')[1];

      if (auth.permissions[view] == null || auth.permissions[view][button] == null) {
        return false;
      }

      if (auth.permissions[view][button] == 'Y') {
        return true;
      }
    }

    return false;
  };

  auth.currentUser = function() {
    return $window.sessionStorage.user;
  };

  auth.isLoggedIn = function() {
    return $window.sessionStorage.loginUserIdx != null;
  };

  return auth;
});
