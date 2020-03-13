/**
 * sort-array-object.js는 object Type들로 이루어진 Array에 대한 정렬을 제공하는 기능이다. 숫자 타입의 속성 값만 비교 가능하다.
 * Params - input: 정렬할 데이터
 * Params - attr : 정렬 기준 항목
 */
webapp.factory('sortArrayFactory', ['$resource', 'GLOBAL_CONSTANT', function sortArrayFactory($resource, CONSTANT) {
    return {
        sortArrayObject: function(input, attr){
            if(!angular.isArray(input)){
                return input;
            }
            input.sort(function(pre, post){
                try{
                    a = parseInt(pre[attr]);
                    b = parseInt(post[attr]);
                    return a - b;
                }catch(ex){
                    throw new Error('NumberFormat Error.');
                    return input;
                }
            })
            return input;
        }
    }
}]);
