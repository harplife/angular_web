webapp.filter('byteCheck', function () {
	return function(text,b,i,c){
		if(angular.isUndefined(text)) return 0;
		for(b=i=0;c=text.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
		return b;
	}
});

/**
 * Usage
 * {{text|byteCheck}} / 2000byte
 * Output
 * "12 / 2000byte"
 *
 */
