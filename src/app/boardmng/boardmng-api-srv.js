webapp.service('BoardMngAPISrv', [ '$resource', 'StaticVariable','$rootScope', function BoardMngAPISrv($resource, staticVariable,$rootScope) {
  return {

    getBoardMngApi : function() {
      return $resource(staticVariable.getUrl('/api/boardmng/metatables/:tableNm') + '.json', {
        tableNm : '@tableNm',userkey:$rootScope.gVariable.userKey
      }, staticVariable.getRequestActions.defaultAction());
    },
    getUsingMetaTableNm : function() {
      return $resource(staticVariable.getUrl('/api/boardmng/metatables/:tableNm/info') + '.json', {
        tableNm : '@tableNm',userkey:$rootScope.gVariable.userKey
      }, staticVariable.getRequestActions.defaultAction());
    },
    doModuleTypeList: function() {
      return $resource(staticVariable.getUrl('/select/CommonCode.getCommonCodeValue/action.json'), {userkey:$rootScope.gVariable.userKey},
        staticVariable.getRequestActions.defaultAction());
    },

  };
}, ]);
