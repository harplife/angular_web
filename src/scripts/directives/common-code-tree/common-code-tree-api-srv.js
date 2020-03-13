webapp.service('CommonCodeTreeAPISrv', ['$resource', 'StaticVariable',
    function CommonCodeTreeAPISrv($resource, StaticVariable) {
    	var commonApi = {
       		doComboCode : function() {
       			return $resource(StaticVariable.getUrl('/api/system/getCommonCodeList.json'), {},
       					StaticVariable.getRequestActions.defaultAction());
   			},
    	};
    	return commonApi;
	}
]);

