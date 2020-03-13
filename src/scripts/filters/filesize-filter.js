// add the filter to your application module
webapp.filter('filesize', function ($sce) {
		return function (bytes) {
	        if(bytes < 1024) return bytes + " Bytes";
	        else if(bytes < 1048576) return(bytes / 1024).toFixed(2) + " KB";
	        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(2) + " MB";
	        else return(bytes / 1073741824).toFixed(2) + " GB";
		};
	});
/**
 * Usage
 * var myFile = 5678;
 *
 * {{myText|filesize}}
 *
 * Output
 * "5.54 Kb"
 *
 */
