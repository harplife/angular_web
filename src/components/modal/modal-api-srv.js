webapp.service('ModalAPISrv', ['$rootScope', '$resource', 'StaticVariable',
  function ModalAPISrv($rootScope, $resource, staticVariable) {
    var modalApi = {
      getClientApi: function(){
        return $resource(staticVariable.getUrl('/api/org/clients.json?userkey=' + $rootScope.gVariable.userKey), {},
            staticVariable.getRequestActions.getStandardAction());
      },
      getOrgDeptUserApi: function(){
        return $resource(staticVariable.getUrl('/api/org/department/:deptId/users.json?userkey=' + $rootScope.gVariable.userKey), {
          deptId: '@deptId'
        }, staticVariable.getRequestActions.getStandardAction());
      },
      getOrgDepartmentApi: function(){
        return $resource(staticVariable.getUrl('/api/org/departement/tree.json?userkey=' + $rootScope.gVariable.userKey), {},
            staticVariable.getRequestActions.getStandardAction());
      },
      doDeptList: function() {
        return $resource(staticVariable.getUrl('/select/Department.getDepartmentTree/action.json?userkey=' + $rootScope.gVariable.userKey), {},
          staticVariable.getRequestActions.defaultAction());
      },
      doTenantList: function() {
        alert('doTenantList');
        return $resource(staticVariable.getUrl('/select/Tenant.getTenantSrch/action.json?userkey=' + $rootScope.gVariable.userKey), {},
          staticVariable.getRequestActions.defaultAction());
      },
      doLocationList: function() {
        return $resource(staticVariable.getUrl('/select/Location.getLocationTreeList/action.json?userkey=' + $rootScope.gVariable.userKey), {},
          staticVariable.getRequestActions.defaultAction());
      },
      getUserApi: function(){
        return $resource(staticVariable.getUrl('/select/User.getUserMgrList/action.json?userkey=' + $rootScope.gVariable.userKey), {},
          staticVariable.getRequestActions.defaultAction());
      },
      getUserCntApi: function(){
        return $resource(staticVariable.getUrl('/select/User.getUserMgrListCnt/action.json?userkey=' + $rootScope.gVariable.userKey), {},
          staticVariable.getRequestActions.defaultAction());
      },
      getShopApi: function(){
        return $resource(staticVariable.getUrl('/select/DataAnalysis.getShopList/action.json?userkey=' + $rootScope.gVariable.userKey), {},
            staticVariable.getRequestActions.defaultAction());
      },
      getShopCntApi: function(){
        return $resource(staticVariable.getUrl('/select/DataAnalysis.getShopCount/action.json?userkey=' + $rootScope.gVariable.userKey), {},
            staticVariable.getRequestActions.defaultAction());
      },
      getUserRoleApi: function(){
        return $resource(staticVariable.getUrl('/select/Role.getRoleList/action.json?userkey=' + $rootScope.gVariable.userKey), {},
          staticVariable.getRequestActions.defaultAction());
      },
      getUserRoleCntApi: function(){
        return $resource(staticVariable.getUrl('/select/Role.getRoleListCnt/action.json?userkey=' + $rootScope.gVariable.userKey), {},
          staticVariable.getRequestActions.defaultAction());
      },
      doUpdateDefaultActionDetail : function() {
        return $resource(staticVariable.getUrl('/update/DataAnalysis.updateDefaultActionDetail/action.json?userkey=' + $rootScope.gVariable.userKey), {},
          staticVariable.getRequestActions.defaultAction());
      },
    };
    return modalApi;
  },
]);
