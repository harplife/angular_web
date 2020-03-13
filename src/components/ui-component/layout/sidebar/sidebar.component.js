(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name izzyposWebApp.directive:adminPosHeader
   * @description
   * # adminPosHeader
   */
  SidebarController.$inject = ['GLOBAL_CONSTANT', 'postApi', '$scope', '$rootScope', '$state', '$filter', 'Helper'];
  function SidebarController(CONSTANT, postApi, $scope, $rootScope, $state, $filter, Helper) {

    var vm = this;
    vm.selectedMenu = 'dashboard';
    vm.collapseVar = 0;
    vm.secondCollapseVar = -1;
    vm.threeCollapseVar = -1;
    vm.menuList = [];

    vm.check = function (x) {
      if (x == vm.collapseVar)
        vm.collapseVar = 0;
      else
        vm.collapseVar = x;
    };

    vm.secondCheck = function (y) {
      if (y == vm.secondCollapseVar)
        vm.secondCollapseVar = 0;
      else
        vm.secondCollapseVar = y;
    };

    vm.threeCheck = function (y) {
      if (y == vm.threeCollapseVar)
        vm.threeCollapseVar = 0;
      else
        vm.threeCollapseVar = y;
    };

    $scope.$on('broadcastSetChangeMenuList', function(event, args) {
      vm.loadMenuData();
    });

    vm.loadMenuData = function () {
      vm.menuList = [];
      var mobileOnlyYN = "N";
      //if(checkMobile()) mobileOnlyYN = 'Y';
      var data = { mapCode: 'Menu.getMenuList', mobileOnlyYN : mobileOnlyYN};
      postApi.select(data, function (result) {
        if (result != null && result.header != null && result.header.status === CONSTANT.HttpStatus.OK) {
          vm.makeMenuList(result.body.docs, true);
          //var count = result.body.docs.length;
          var interval = setInterval(function() {
            if( vm.menuList.length > 0) {
              $(".sz-custom-navbar-toggle").css("display","block");
              initNavView();
              clearInterval(interval);
            }
          }, 600);
        } else {
          if (result != null && result.header != null && result.body != null)
            console.error('Error> setBaseMenuInfo', result.header.status, result.body.docs[0]);
          else
          console.error('Error> setBaseMenuInfo');
        }
      }, function (error) {
        console.error('Error> setBaseMenuInfo', error);
      });
    };
    vm.loadMenuData();

    function makeSortPath(sort) {

      var sort = sort.toString();
      var result = Array();
      if(sort.length >= 3) {
        result.push(sort.substring(0, 3));
      }
      if(sort.length >= 6) {
        result.push(sort.substring(3, 6))
      }
      if(sort.length == 9) {
        result.push(sort.substring(6, 9))
      }
      return result;
    }
    vm.makeMenuList = function (data) {

      /* temp :
        Menu에 바로 데이터를 바인딩할 경우
        바인딩한 데이터를 바로 화면에 그리기 때문에 속도에 문제가 있어
        temp 에서 선 작업 한 후 메뉴리스트에 값을 대입
      */
      var temp = [];
      var bFoundMainPage = false;
      var mainPage = '';

      for (var i = 0; i < data.length; i++) {
        var o = {};
        o.menuId = data[i].menuId;
        o.depth = data[i].depth;
        o.name = data[i].menuNm;
        o.icon = data[i].icon;
        o.sort = data[i].sort;
        o.tempSortPath = makeSortPath(data[i].sort);
        o.idx = i;

        if(data[i].menuCode != null && data[i].menuCode != undefined) {
          o.menuCode = data[i].menuCode;
        }
        o.child = [];

        o.pageUrl = data[i].pageUrl;
        o.pageUrlParam = data[i].pageUrlParam;

        if (Number(data[i].depth) == 1) {
          temp.push(o);
        } else {
          var temp2;
          if(o.tempSortPath.length == 2) temp2 = o.tempSortPath[0];
          else temp2 = o.tempSortPath[0] + '' + o.tempSortPath[1];
          var sData = vm.findObject(temp, 'sort', temp2);
          if (sData['child'])
            sData['child'].push(o);
        }

        // var page = Helper.stateIs(data[i].pageUrl);
        // if (page == $rootScope.gVariable.mainPage) {
        //   bFoundMainPage = true;
        // }
      }

      // if (!bFoundMainPage && data.length > 0) {
      //   $rootScope.setGVariable('mainPage', Helper.stateIs(data[0].pageUrl));
      //   $state.go(data[0].pageUrl);
      // }

      vm.menuList = temp;
    };

    vm.findObject = function (obj, key, value) {
      for (var i = 0; i < obj.length; i++) {
        for (var objKey in obj[i]) {
          if (objKey == key) {
            if (obj[i][objKey] == value) {
              return obj[i];
            }
          }
        }
        if (obj[i]["child"].length > 0) {
          var result = vm.findObject(obj[i]["child"], key, value);
          if (result != false) return result;
        }
      }
      return false;
    };

    function getData() {
      var srch = {};
      srch.mapCode = "MaDatagroup.getDatagroupAndAction";

      var prms = postApi.select(srch, function(result) {
        if (result.header.status === CONSTANT.HttpStatus.OK) {
          if (result.body.docs.length == 0) {
            $rootScope.setGVariable('dataGroupId', '');
            $rootScope.setGVariable('dataActionId', '');
            $rootScope.setGVariable('dataGroupNm', '');
            $rootScope.setGVariable('dataActionNm', '');
          } else {
            var data = result.body.docs[0];
            $rootScope.setGVariable('dataGroupId', data.DatagroupId);
            $rootScope.setGVariable('dataActionId', data.ActionId);
            $rootScope.setGVariable('dataGroupNm', data.DatagroupNm);
            if (data.ActionId) {
              $rootScope.setGVariable('dataActionNm', data.ActionNm + ' (' + $filter('utcToLocal')(data.ABeginDate,'yyyy-MM-dd') + '~' + $filter('utcToLocal')(data.AEndDate,'yyyy-MM-dd') + ')');
            }
          }
        }
      }, function(error) {
        console.table(error);
      });
    }

    getData();
  }

  // Header 쪽에 선언 하는 것이 맞으나
  // 소스 찾기가 어려울 것 같아 한 곳에 선언
  // Window Resize Event에 따른 HTML 에 사이즈 선언 함
  /**
* @description
*  메뉴 초기 설정
*/
  function initNavView() {

    setOsAgent();
    setToggleBtnEvent();
    setMenuEvent();
    setResizeEvent();
    setTimeout(function(){
        $(".side_wrapper").mCustomScrollbar();
    },1000);
  }

  function setMenuEvent() {

    $(".sidebar-nav > ul > li > a").click(function(e) {
      var currentState = $("body").attr("nav-state").split("-");
      if(currentState[0] == "md") {
        if(currentState[1].indexOf('rm') > -1 || currentState[1].indexOf('lm') > -1 || currentState[1].indexOf('s') > -1) {
          e.stopImmediatePropagation();
        }
      }
    });

    $(".sidebar-nav  ul  li  a").click(function(e) {
      if( $(this).attr("ui-sref") != undefined && $(this).attr("ui-sref") != "" ) {
        e.stopImmediatePropagation();
        var aThis = $(this);
        setTimeout(function(){
          $(".sidebar-nav  ul  li").removeClass("active");
          $(aThis).closest("li").addClass("active");
          $(aThis).closest("li").parent().closest("li").addClass("active");
          $(aThis).closest("li").parent().closest("li").parent().closest("li").addClass("active");
        },0);
      } else {

      }
    });

    $(".sidebar-nav > ul > li").hover(function(e) {
      var currentState = $("body").attr("nav-state").split("-");
      if(currentState[0] == "md") {
        if(currentState[1].indexOf('rm') > -1 || currentState[1].indexOf('lm') > -1 || currentState[1].indexOf('s') > -1) {

          $(this).addClass('active');
          $(this).find("> ul").css("overflow","auto");
          $(this).find("> ul").addClass("in");
          $(this).find("> ul").css("height", "auto");
          $(this).find("> ul").attr("aria-expanded", "true");
          $(this).find("> ul").attr("aria-hidden", "false");

          var offset = $(this).offset();
          $(this).find("> ul").css("top", offset.top);
          var $ulObj = $(this).find("> ul");
          var $thisObj = $(this);
          var ulHeight = ($ulObj.find('li').height() * $ulObj.find('li').length)
          if(offset.top + ulHeight > $(window).height()) {
            $ulObj.css("top","");
            $ulObj.css("bottom", $(window).height() - offset.top - $thisObj.height());
          }
        } else {
          $(this).find("> ul").css("top", "");
          $(this).find("> ul").css("bottom", "");
        }
      } else {
        $(this).find("> ul").css("top", "");
        $(this).find("> ul").css("bottom", "");
      }
    }, function(e){
      var currentState = $("body").attr("nav-state").split("-");
      if(currentState[0] == "md") {
        if(currentState[1].indexOf('rm') > -1 || currentState[1].indexOf('lm') > -1 || currentState[1].indexOf('s') > -1) {

          $(this).removeClass('active');
          $(this).find("> ul").removeClass("in");
          $(this).find("> ul").css("overflow","");
          $(this).find("> ul").css("height", "0px");
          $(this).find("> ul").attr("aria-expanded", "false");
          $(this).find("> ul").attr("aria-hidden", "true");

        } else {
          $(this).find("> ul").css("top", "");
          $(this).find("> ul").css("bottom", "");
        }
      } else {
        $(this).find("> ul").css("top", "");
        $(this).find("> ul").css("bottom", "");
      }
    });
  }

  /**
  * @description
  *  OS Agent 설정
  */
  function setOsAgent() {
    var isMobile = false;

    // Mobile 여부 확인
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
      isMobile = true;

    if (isMobile) {
      $("body").attr("is-device", "Y");
    } else {
      $("body").attr("is-device", "N");
    }

  }

  function changeNavState() {
    var currentState = $("body").attr("nav-state").split("-");
    var winWidth = $(window).width();

    if (winWidth < 768 ) {
      (currentState[1] == "on") ? currentState[1] = "off" : currentState[1] = "on";
      $("body").attr("nav-state", currentState[0] + "-" + currentState[1])
      if(currentState[1] == "on") setBlockLayer();
      else $("#nav-block-screen").detach();
    } else {
      var localStorage = window.localStorage;
      var navState = localStorage.getItem("navMenuMdSizeState");
      $("body").attr("nav-state", currentState[0] + "-" + navState);
    }
    setToggleImage();
  }

  /**
  * @description
  *  초기 페이지 진입시 Layer 설정
  */
  function setBlockLayer() {
    var $div = $("<div />", {
      id: "nav-block-screen",
      onclick: "changeNavState();"
    });
    $("html body").append($div.clone());
    $("#nav-block-screen").bind("click", function(){
      changeNavState();
    });
  }



  /**
  * @description
  *  토글 버튼 클릭시 nav state 값 변경
  */
  function setToggleBtnEvent() {
    $(".sz-custom-navbar-toggle").bind("click", function () {
      $(this).addClass("focus");
      var winWidth = $(window).width();

      if (winWidth < 768 ) {
        changeNavState();
      } else {
        var localStorage = window.localStorage;
        var navState;
        if( $("body").attr("nav-state") != undefined) navState = $("body").attr("nav-state").split("-")[1];
        else navState = localStorage.getItem("navMenuMdSizeState");

        if(navState == "l") {
          navState = "lm";
          hiddenSecondMenus()
        } else if(navState == "lm") {
          navState = "s";
          hiddenSecondMenus()
        } else if(navState == "s") {
          navState = "rm";
          hiddenSecondMenus()
        } else if(navState == "rm") {
          navState = "l";
        }
        localStorage.setItem('navMenuMdSizeState', navState);
        changeNavState();
      }

      setTimeout(function () { $(".sz-custom-navbar-toggle").removeClass("focus"); }, 150);
    });
  }

  function hiddenSecondMenus() {
    //$(".sidebar-nav > ul > li > ul").removeClass('active');
    $(".sidebar-nav > ul > li > ul").removeClass("in");
    $(".sidebar-nav > ul > li > ul").css("overflow","");
    $(".sidebar-nav > ul > li > ul").css("height", "0px");
    $(".sidebar-nav > ul > li > ul").attr("aria-expanded", "false");
    $(".sidebar-nav > ul > li > ul").attr("aria-hidden", "true");

  }

  function setToggleImage() {

    if ($(window).width() < 768 ) {
      $(".sz-custom-navbar-toggle i").removeClass('fa-outdent');
      $(".sz-custom-navbar-toggle i").removeClass('fa-indent');
      $(".sz-custom-navbar-toggle i").addClass('fa-bars');
    } else {
      var localStorage = window.localStorage;
      var navState = localStorage.getItem("navMenuMdSizeState");
      $(".sz-custom-navbar-toggle i").removeClass('fa-bars');
      if(navState == "l") {
        $(".sz-custom-navbar-toggle i").addClass('fa-outdent');
        $(".sz-custom-navbar-toggle i").removeClass('fa-indent');
      } else if(navState == "lm") {
        $(".sz-custom-navbar-toggle i").addClass('fa-outdent');
        $(".sz-custom-navbar-toggle i").removeClass('fa-indent');
      } else if(navState == "s") {
        $(".sz-custom-navbar-toggle i").removeClass('fa-outdent');
        $(".sz-custom-navbar-toggle i").addClass('fa-indent');
      } else if(navState == "rm") {
        $(".sz-custom-navbar-toggle i").removeClass('fa-outdent');
        $(".sz-custom-navbar-toggle i").addClass('fa-indent');
      }
    }
  }

  /**
  * @description
  *  화면 사이즈 변경 시 html element에 nav state 값을 변경해주는 함수
  */
  function setResizeEvent() {
    $(window).resize(function () {
      initNavState();
    });
  }

  /**
  * @description
  *  window 넓이에 따른 값 셋팅
  */
  function initNavState() {
    var winWidth = $(window).width();
    if (winWidth < 560) $("body").attr("nav-state", "xs-off");
    else if (winWidth < 768) $("body").attr("nav-state", "sm-off");
    else if (winWidth > 767 ) {

      if($("#nav-block-screen").length > 0) $("#nav-block-screen").detach();
      var localStorage = window.localStorage;
      var navState = localStorage.getItem("navMenuMdSizeState");
      if(navState == null || navState == undefined || navState == "on" || navState == "off") {
        navState = "l";
        localStorage.setItem('navMenuMdSizeState', navState);
      }
      $("body").attr("nav-state", "md-" + navState);
    }
    setToggleImage();
  }

  angular.module('salevis4-web')
    .component('sidebar', {
      templateUrl: 'components/ui-component/layout/sidebar/sidebar.html',
      controller: SidebarController,
      controllerAs: 'sidebar'
    });

})();
