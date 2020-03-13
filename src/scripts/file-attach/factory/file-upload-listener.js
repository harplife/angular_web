webapp.factory('fileUploadListener', fileUploadListener);
function fileUploadListener() {
	this.listener = {
			setListener: function(listener){
				this.listener = listener;
			},
			getListener: function()
			{
				return this.listener;
			}
		};
	return this.listener;
};
