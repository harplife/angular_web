/*!
 * url-encode필터는 url에서 사용하면 안되는 특수 문자를 인코딩해 주는 필터이다..
 * */
webapp.filter('toLocaleDate', ['$filter', '$window', 'StaticVariable', function($filter, $window, variables) {
    return function(dateNumber) {
        var localeDate;
        var toLocalDate = '';
//        $window.localStorage.loginUserLang 변경 필요.
        var format = variables.getDateFormat('ko', false);

        if(typeof dateNumber == 'string' && dateNumber != ''){
            localeDate = new Date(parseInt(dateNumber));
        }else if(typeof dateNumber == 'number'){
            localeDate = new Date(dateNumber);
        }else{
            return '';
        }

        if(format != ''){
            toLocalDate = $filter('date')(localeDate, format);
        }else{
            toLocalDate = localeDate.toLocaleDateString();
        }
        return toLocalDate;
    };
}]);
