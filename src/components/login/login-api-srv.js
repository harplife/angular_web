webapp.service('LoginAPISrv', [ '$resource', '$rootScope', 'StaticVariable', function LoginAPISrv($resource, $rootScope, StaticVariable) {
  var loginApi = {
    doLogin : function(obj) {
      return $resource(StaticVariable.getUrl('/login/login.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    doLogout : function(obj) {
      return $resource(StaticVariable.getUrl('/login/logout.json'), {userkey:$rootScope.gVariable.userKey}, StaticVariable.getRequestActions.defaultAction());
    },
    doCustomerLogin : function(obj) {
      return $resource(StaticVariable.getUrl('/login/loginCustomer.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    doCheckSession : function(obj) {
      return $resource(StaticVariable.getUrl('/login/checkSession.json'), {userkey:$rootScope.gVariable.userKey}, StaticVariable.getRequestActions.defaultAction());
    },
    doPersonal_IdSrch : function(obj) {
      return $resource(StaticVariable.getUrl('/login/personal_IdSrch.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    doCompany_IdSrch : function(obj) {
      return $resource(StaticVariable.getUrl('/login/company_IdSrch.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    doPersonal_PwSrch : function(obj) {
      return $resource(StaticVariable.getUrl('/login/personal_PwSrch.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    doCompany_PwSrch : function(obj) {
      return $resource(StaticVariable.getUrl('/login/company_PwSrch.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    doResetPassword : function() {
      return $resource(StaticVariable.getUrl('/login/resetPassword.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    doSaveResetPwAutoMail : function() {
      return $resource(StaticVariable.getUrl('/login/insertAutoMail.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    doCreateUser : function(obj) {
      return $resource(StaticVariable.getUrl('/login/signupUser.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    doCheckLoginId : function(obj) {
      return $resource(StaticVariable.getUrl('/login/checkLoginId.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    doMetaColumns : function(obj) {
      return $resource(StaticVariable.getUrl('/login/getMetaColumns.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    doGetTenant : function(obj) {
      return $resource(StaticVariable.getUrl('/login/getTenant.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
  };
  return loginApi;
} ]);
