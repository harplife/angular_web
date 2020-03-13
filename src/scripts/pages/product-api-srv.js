webapp.service('ProductAPISrv', ['$resource', 'StaticVariable',
  function ProductAPISrv($resource, StaticVariable) {
    var api = {
      doList: function() {
        return $resource(StaticVariable.getUrl('/openapi/getProductInfoList.json'), {},
          StaticVariable.getRequestActions.defaultAction());
      },
      doListCount: function() {
        return $resource(StaticVariable.getUrl('/openapi/getBoardInfoCount.json'), {},
          StaticVariable.getRequestActions.defaultAction());
      },
      doDetail: function() {
        return $resource(StaticVariable.getUrl('/openapi/getProductInfoDetail.json'), {},
          StaticVariable.getRequestActions.defaultAction());
      },
      doFileList: function() {
        return $resource(StaticVariable.getUrl('/openapi/getFileList.json'), {},
          StaticVariable.getRequestActions.defaultAction());
      },
      doSupplementList: function() {
        return $resource(StaticVariable.getUrl('/openapi/getSupplementInfoList.json'), {},
          StaticVariable.getRequestActions.defaultAction());
      },
    };
    return api;
  },
]);
