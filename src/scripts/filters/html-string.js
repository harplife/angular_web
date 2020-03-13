
webapp.filter('htmlString', function($sce){
	return function(val){
		if(val) {
			return $sce.trustAsHtml(val);
		}else{
		    return val;
		}
	};
});

