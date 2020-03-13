(function() {
  "use strict";

  webapp.filter("localToUtc", Filter);

  function Filter($filter) {
    return function(localeDateString, type, timezoneOffset) {
      var localeDate;
      var utcDate;
      var toUtcDate = "";

      if (!localeDateString) {
        return;
      }

      if (typeof localeDateString === "string" && localeDateString != "") {
        var dateArr = localeDateString.split("-");
        if (dateArr.length == 3) {
          localeDate = new Date(dateArr[0], parseInt(dateArr[1]) - 1, dateArr[2], 0, 0, 0);
        }
      } else if (typeof localeDateString === "object" && localeDateString instanceof Date) {
        localeDate = localeDateString;
      } else {
        return "";
      }

      if (!timezoneOffset || timezoneOffset == 0) {
        if (!type) {
          utcDate = new Date(localeDate.getTime() + (localeDate.getTimezoneOffset() * 60000));
        } else if (type == 'from') {
          utcDate = new Date(localeDate.getTime() + (localeDate.getTimezoneOffset() * 60000));
        } else if (type == 'to') {
          utcDate = new Date(localeDate.getTime() + (localeDate.getTimezoneOffset() * 60000) + 86399000);
        }
      } else {
        if (!type) {
          utcDate = new Date(localeDate.getTime() + (-1 * timezoneOffset * 60 * 60000));
        } else if (type == 'from') {
          utcDate = new Date(localeDate.getTime() + (-1 * timezoneOffset * 60 * 60000));
        } else if (type == 'to') {
          utcDate = new Date(localeDate.getTime() + (-1 * timezoneOffset * 60 * 60000) + 86399000);
        }
      }

      toUtcDate = $filter("date")(utcDate, 'yyyy-MM-dd HH:mm:ss');

      return toUtcDate;
    };
  }
})();
