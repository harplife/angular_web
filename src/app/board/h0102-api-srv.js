webapp.service('H0102APISrv', ['$resource', 'StaticVariable', '$rootScope',
  function H0102APISrv($resource, StaticVariable, $rootScope) {
    var bbspostApi = {
      doSelectListColumns: function() {
        return $resource(StaticVariable.getUrl('/select/MetaColumn.getSelectListColumns/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doList: function() {
        return $resource(StaticVariable.getUrl('/select/BbsPost.getBbsPostList/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doListCnt: function() {
        return $resource(StaticVariable.getUrl('/select/BbsPost.getBbsPostListCnt/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doExcel: function() {
        return $resource(StaticVariable.getUrl('/excel/BbsPost.getExcelBbsPostList/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doDetail: function() {
        return $resource(StaticVariable.getUrl('/select/BbsPost.getBbsPostDetail/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doDelete: function() {
        return $resource(StaticVariable.getUrl('/update/BbsPost.deleteBbsPost/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doSelectEditColumns: function() {
        return $resource(StaticVariable.getUrl('/select/MetaColumn.getSelectEditColumns/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doInsertDetail: function() {
        return $resource(StaticVariable.getUrl('/insert/BbsPost.insertBbsPost/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doUpdateDetail: function() {
        return $resource(StaticVariable.getUrl('/update/BbsPost.updateBbsPost/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doInsertUdcDetail: function() {
        return $resource(StaticVariable.getUrl('/api/udc/udcInsert.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doUpdateUdcDetail: function() {
        return $resource(StaticVariable.getUrl('/api/udc/udcUpdate.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doDeleteUdcDetail: function() {
        return $resource(StaticVariable.getUrl('/api/udc/udcDelete.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doFileList: function() {
        return $resource(StaticVariable.getUrl('/select/FileAttach.getFileList/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doSaveAttachFile: function() {
        return $resource(StaticVariable.getUrl('/attach/saveAttachFile.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      attachFileDelete: function() {
        return $resource(StaticVariable.getUrl('/attach/file/delete.do'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doReply: function() {
        return $resource(StaticVariable.getUrl('/select/BbsPost.getBoardComment/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doSaveReply: function() {
        return $resource(StaticVariable.getUrl('/insert/BbsPost.insertBoardComment/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doDeleteReply: function() {
        return $resource(StaticVariable.getUrl('/update/BbsPost.deleteBoardComment/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
      doUpdateReply: function() {
        return $resource(StaticVariable.getUrl('/update/BbsPost.updateBoardComment/action.json'), {userkey:$rootScope.gVariable.userKey},
          StaticVariable.getRequestActions.defaultAction());
      },
    };
    return bbspostApi;
  },
]);
