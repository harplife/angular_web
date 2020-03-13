webapp.service('CounselAPISrv', [ '$resource', '$rootScope', 'StaticVariable', function CounselAPISrv($resource, $rootScope, StaticVariable) {
  var counselApi = {
    insertCounsel: function() {
      return $resource(StaticVariable.getUrl('/openapi/insertCounsel.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
  };
  return counselApi;
} ]);
