(function() {
  "use strict";

  webapp.filter("utcToLocal", Filter);

  function Filter($filter) {
    return function(utcDateString, format) {
      var localeDate;
      var toLocalDate = "";

      if (!utcDateString) {
        return;
      }

      if (typeof utcDateString == "string" && utcDateString != "") {
        localeDate = new Date(parseInt(utcDateString));
      } else if (typeof utcDateString == "number") {
        localeDate = new Date(utcDateString);
      } else {
        return "";
      }

      //localeDate += 'Z';

      if (format != "") {
        toLocalDate = $filter("date")(localeDate, format);
      } else {
        toLocalDate = localeDate.toLocaleDateString();
      }

      return toLocalDate;
    };
  }
})();
