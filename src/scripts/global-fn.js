webapp.run(function ($rootScope, $window, $resource, StaticVariable, GLOBAL_CONSTANT, $mdToast, $filter) {
  $rootScope.windowOpen = function (url, name, w, h) {
    //TODO : your custom code here.
    if (angular.isUndefined(w)) w = 1000;
    if (angular.isUndefined(h)) h = 800;

    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;

    if (left < 0) left = 0;
    if (top < 0) top = 0;

    console.log('$window.open(', 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left + ')');
    $window.open(url, name, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
  };

//yyyy-mm-dd > new Date 형태로 변환
  $rootScope.getDateFormat = function(dateStr) {
    var dateArr;

    if (typeof(dateStr) == "undefined") {
      return null;
    }
    else {
      dateArr = dateStr.split("-");
    }

    if (dateArr.length == 3) {
      return new Date(dateArr[0], parseInt(dateArr[1]) - 1, dateArr[2]);
    }
    else {
      return null;
    }
  };

  $rootScope.getDate = function(date) {
    if (!date) return null;

    return new Date(date);
  };

  $rootScope.setUserSession = function(data) {
    $window.sessionStorage['isLoggedIn'] = 'Y';
    $window.sessionStorage['loginUserId'] = data.loginId;
    $window.sessionStorage['loginUserIdx'] = data.userId;
    $window.sessionStorage['loginSysAdminYN'] = data.sysAdminYN;
    $window.sessionStorage['loginUserName'] = data.userName;
    $window.sessionStorage['loginUserGbn'] = data.userGroupId;
    $window.sessionStorage['loginUserDeptNm'] = data.DeptNm;
    $window.sessionStorage['loginUserDeptId'] = data.DeptId;
    $window.sessionStorage['loginComGbn'] = data.company;
    $window.sessionStorage['loginUserType'] = data.userType;
    $window.sessionStorage['loginUserEmail'] = data.email;
    $window.sessionStorage['loginTenantId'] = data.TenantId == null ? 0 : data.TenantId;
    $window.sessionStorage['loginTenantName'] = data.TenantName;
    $window.sessionStorage['loginTenantDir'] = data.TenantDir == null ? null : data.TenantDir;
    $window.sessionStorage['loginEmail'] = data.Email;
    $window.sessionStorage['loginTelNo'] = data.TelNo;
    $window.sessionStorage['loginMobile'] = data.Mobile;
    $window.sessionStorage['noHeader'] = data.noHeader == null ? false : data.noHeader;
    $window.sessionStorage['mainPage'] = data.mainpage == null ? 'app.dashboard' : data.mainpage;
    $window.sessionStorage['mainPageSrch'] = data.mainpagesrch == null ? '' : data.mainpagesrch;
    $rootScope.gVariable.UserId = $window.sessionStorage['loginUserIdx'];
    $rootScope.gVariable.TenantId = $window.sessionStorage['loginTenantId'];
    $rootScope.gVariable.TenantName = $window.sessionStorage['loginTenantName'];
    $rootScope.gVariable.TenantDir = $window.sessionStorage['loginTenantDir'];
    $rootScope.gVariable.SysAdminYN = $window.sessionStorage['loginSysAdminYN'];
    $rootScope.gVariable.Email = $window.sessionStorage['loginEmail'];
    $rootScope.gVariable.TelNo = $window.sessionStorage['loginTelNo'];
    $rootScope.gVariable.UserName = $window.sessionStorage['loginUserName'];
    $rootScope.gVariable.userType = $window.sessionStorage['loginUserType'];
    $rootScope.gVariable.DeptNm = $window.sessionStorage['loginUserDeptNm'];
    $rootScope.gVariable.DeptId = $window.sessionStorage['loginUserDeptId'];
    $rootScope.gVariable.Mobile = $window.sessionStorage['loginMobile'];
    $rootScope.gVariable.noHeader = $window.sessionStorage['noHeader'];
    $rootScope.gVariable.mainPage = $window.sessionStorage['mainPage'];
    $rootScope.gVariable.mainPageSrch = $window.sessionStorage['mainPageSrch'];
    if (data.userkey) {
      $window.sessionStorage['userkey'] = data.userkey;
      $rootScope.gVariable.userKey = $window.sessionStorage['userkey'] + '-' + $window.sessionStorage['loginTenantId'];
    }
    //console.log($window.sessionStorage);
  };

  $rootScope.setDefaultSelectedShop = function() {
    var srch = {viewSize:1, page:1, UseYN:'Y'};

    var prms = $resource(StaticVariable.getUrl('/select/MaDatagroup.getDatagroupList/action.json'), {userkey:$rootScope.gVariable.userKey}, StaticVariable.getRequestActions.defaultAction()).post(srch).$promise;

    prms.then(
    function(data) {
      if (data.responseVO.header.status == GLOBAL_CONSTANT.HttpStatus.OK) {
        // select한 datatable 바인딩
        $rootScope.gVariable.selectedShop = data.responseVO.body.docs[0];
      }
    },
    function(error) {
      //console.error('fail', status, data);
      console.error("Error> setDefaultSelectedShop()");
      console.table(error);
    });
  };

  $rootScope.showSimpleToast = function(msg, p1, p2) {
    var position = "";
    var delay = 1200;
    if(p1 == undefined) {
      var classTx = "header-toast";
      $mdToast.show(
        $mdToast.simple({
          template: '<md-toast class="md-toast ' + classTx +'">' +
          '<div class="md-toast-content">' + msg + '</div></md-toast>',
          position: "top left",
          hideDelay : delay
        })
      );
    } else if(p1.indexOf("#") > -1) {
      if(p2 != undefined) p2 = position;
      else p2 = "top left";
      $mdToast.show(
        $mdToast.simple()
        .parent(angular.element(document.querySelector(p1)))
        .content(msg)
        .position(p2)
        .hideDelay(delay)
      );
    } else {
      var classTx = "";
      if (p1 == undefined) {
        classTx = "header";
      } else if(p1.toLowerCase() == "header" || p1.toLowerCase() == "footer") {
        classTx = p1 + "-toast";
      } else {
        position = p1;
      }

      if(classTx == "") {
        $mdToast.show(
          $mdToast.simple()
          .content(msg)
          .position(position)
          .hideDelay(delay)
        );
      } else {
        var position = "";
        if(p1.toLowerCase() == "footer") position = "bottom left";
        else position = "top left";
        $mdToast.show(
          $mdToast.simple({
            template: '<md-toast class="md-toast ' + classTx +'">' +
            '<div class="md-toast-content">' + msg + '</div></md-toast>',
            position: position,
            hideDelay : delay
          })
        );
      }
    }
  };

  $rootScope.listColumFilter = function(liCol) {
    if (liCol.ListColumnShowLevel == 'showlevel0') {
      return false;
    }

    return true;
  };
});
