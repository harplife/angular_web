/*!
 * nl2br필터는 carriage return 값을 html의 <br/>로 바꿔준다.
 * */
webapp.filter('nl2brString', function($sce){
    return function(val){
        if(angular.isString(val)) {
            return $sce.trustAsHtml(val.replace(/\n/g, '<br/>'));
        }else{
            return val;
        }
    };
});

