webapp.service('SurveyAPISrv', [ '$resource', '$rootScope', 'StaticVariable', function SurveyAPISrv($resource, $rootScope, StaticVariable) {
  var surveyApi = {
    getSurveyDetail : function(obj) {
      return $resource(StaticVariable.getUrl('/openapi/getWjmSurveyDetail.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    getSurveyQstDetail: function() {
      return $resource(StaticVariable.getUrl('/openapi/getWjmSurveyQstDetail.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    getSurveyQstItemDetail: function() {
      return $resource(StaticVariable.getUrl('/openapi/getWjmSurveyQstItemDetail.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
      getImageDropListConcat: function() {
      return $resource(StaticVariable.getUrl('/openapi/getImageDropListConcat.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    getSurveyRespHistCheck: function() {
      return $resource(StaticVariable.getUrl('/openapi/getSurveyRespHistCheck.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    insertSurveyTarget: function() {
      return $resource(StaticVariable.getUrl('/openapi/insertSurveyTarget.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    updateSurveyRespHist: function() {
      return $resource(StaticVariable.getUrl('/openapi/updateSurveyRespHist.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    getMiniResultDetail: function() {
      return $resource(StaticVariable.getUrl('/openapi/getMiniResultDetail.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    getSurveyRespHistTmpList: function() {
      return $resource(StaticVariable.getUrl('/openapi/getSurveyRespHistTmpList.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
    updateSurveyRespHistTmp: function() {
      return $resource(StaticVariable.getUrl('/openapi/updateSurveyRespHistTmp.json'), {}, StaticVariable.getRequestActions.defaultAction());
    },
  };
  return surveyApi;
} ]);
