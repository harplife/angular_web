/* "use strict"; */
webapp.service("Helper", ["$state","$location",
  function($state, $location) {
    var services = {};

    function objectKeys(object) {
      var result = [];

      angular.forEach(object, function(val, key) {
        result.push(val);
      });
      return result;
    }

    services.stateIs = function(state_name) {
      var names = state_name.split('.');
      var state = '';
      var url = '';

      angular.forEach(names, function(name) {
        state = state == '' ? name : state + '.' + name;
        if ($state.get(state)) {
          url = url + $state.get(state).url;
        }
      });

      return url;
    };

    return services;
  }
]);
