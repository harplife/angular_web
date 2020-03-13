/* 'use strict'; */

var szNavCustomType = "LEFT";
var szNavStyle;

(function ($) {

/*   szNavStyle = {

    init : function(){
    }
  };
  szNavStyle.init(); */

})(jQuery);

(function ($) {

  if (typeof String.prototype.replaceAll !== "function") {
    String.prototype.replaceAll = function (target, replacement) {
      return this.split(target).join(replacement);
    };
  }

  if (typeof String.prototype.trim !== "function") {
    String.prototype.trim = function () {
      return this.replace(/(^\s*)|(\s*$)/gi, "");
    };
  }

  if (typeof String.prototype.comma !== "function") {
    String.prototype.comma = function () {
      return this.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    };
  }

  if (typeof Number.prototype.comma !== "function") {
    Number.prototype.comma = function () {

      return this.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    };
  }

  if (typeof String.prototype.fillStr !== "function") {
    String.prototype.fillStr = function (str, len) {
      var orgStr = this.toString();
      while (orgStr.toString().length < len) {
        orgStr = str + orgStr;
      }
      return orgStr;
    };
  }

  if (typeof String.prototype.left !== "function") {
    String.prototype.left = function (len) {
      var orgStr = this.toString();
      return orgStr.substring(0, len);
    };
  }

  if (typeof String.prototype.right !== "function") {
    String.prototype.right = function (len) {
      var orgStr = this.toString();
      return orgStr.substring(orgStr.length - len, orgStr.length);
    };
  }

  if (typeof String.prototype.isNull !== "function") {

    String.prototype.isNull = function () {
      try {
        var orgStr = this.toString();
        if (orgStr == undefined || orgStr == "undefined" || orgStr == null || orgStr == "null" || orgStr.length == 0 || orgStr == " ") return true;
        else return false;
      } catch (e) {
        return true;
      }
    };
  }

  if (typeof $.prototype.hasAttr !== "function") {
    $.prototype.hasAttr = function (name) {
      try {
        var attr = $(this).attr(name);
        if (typeof attr !== typeof undefined && attr !== false) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    };
  }

  var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        }
        else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output = output +
          this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
      }
      return output;
    },
    decode: function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9+/=]/g, "");
      while (i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      return output;
    }
  };

})(jQuery);

function makeDateUUID() {

  // ex : 14 61 20 90 04 27 72 7; : length = 15
  // [년, 월, 일](4) + 요일(1) + 시간(2) + 분(2) + 초(2) + 밀리세컨드(2) + 랜덤숫자(2);
  var date = new Date();
  var year = date.getFullYear();
  var month = String(date.getMonth()+1);
  var day = String(date.getDate());
  var gday = String(date.getDay());
  var hh = String(date.getHours()).fillStr(0,2);
  var mm = String(date.getMinutes()).fillStr(0,2);
  var dd = String(date.getMinutes()).fillStr(0,2);
  var ss = String(date.getSeconds()).fillStr(0,2);
  var ms = String(date.getMilliseconds()).fillStr(0,2).left(2);
  var rand = String(Math.floor(Math.random() * 100)).fillStr(0,2);
  var uuid = year + Number(month) + Number(day) + gday + hh + dd + ss+ ms + rand;
  if(uuid.length != 15) {
    var size = 15 - uuid.length;
    uuid += String(Math.floor(Math.random() * 10000000)+1111111).left(size);
  }
  return uuid;
}

function replacer(key, value) {
  if (!value)
    return undefined;

  return value;
}

function checkMobile() {

  // 모바일 전용
  //if(navigator.userAgent.match(/Mobile|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){

  // 모바일(태블릿 포함)
  if(navigator.userAgent.match(/Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
    return true;
  }

  return false;
}

function enableUploadComponent() {
  var word;
  var agent = navigator.userAgent.toLowerCase();
  var result = false;
  // IE old version ( IE 10 or Lower )
  if (navigator.appName == "Microsoft Internet Explorer") word = "msie ";
  // IE 11
  else if (agent.search("trident") > -1) word = "trident/.*rv:";
  // Microsoft Edge
  else if (agent.search("edge/") > -1) word = "edge/";
  // 그외, IE가 아니라면 ( If it's not IE or Edge )
  else return true;

  var reg = new RegExp(word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");
  if (reg.exec(agent) != null) {
    if (parseFloat(RegExp.$1 + RegExp.$2) > 10) return true;
    else return false;
  }
  return true;
}

function initPageContentMinHeight() {
  var headerHeight = 0;
  if($(".navbar-header").height() == null) headerHeight = 55;
  else headerHeight = $(".navbar-header").height();

  var checkPageInterval = setInterval(function(){
    var offset = $(".page ").eq(0).offset();
    if(offset != undefined) {
      $(".page ").eq(0).css("min-height", $(window).height() - offset.top );
      clearInterval(checkPageInterval);
    }

  }, 300);

}

function initViewLoadedInputBoxStyle() {

  var timerCount = 0;
  var timer = setInterval(function(){
    var input = $(".form-inner-label input");

    if( $(input).length == 0 ) {
      timerCount++;
      if(timerCount == 5) clearInterval(timer);
    } else {
      clearInterval(timer);
      for(var i = 0; i < input.length; i++) {
        var id = $(input).eq(i).attr("id");
        var convId = '';
        if( id == null) id = $(input).eq(i).attr("ng-model");
        if(id == null) continue;
        id = id.split(".");
        for(var j = 0; j < id.length; j++)
          convId += id[j].charAt(0).toUpperCase() + id[j].substring(1, id[j].length);
        convId = convId+ "_" + i;
        if( $(input).eq(i).attr("id")  != "" && $(input).eq(i).attr("id")  != undefined) {
          convId = $(input).eq(i).attr("id") ;
        }
        var placeholder = "";
        if($(input).eq(i).next().length > 0 && $(input).eq(i).next().get(0).tagName.toLowerCase() == "label") {
          $(input).eq(i).next().attr("for", convId);
          $(input).eq(i).attr("id", convId);
          $(input).eq(i).attr("placeholder", " ");
          continue;
        } else if ($(input).eq(i).attr("placeholder") != "" && $(input).eq(i).attr("placeholder") != undefined) {
          placeholder = $(input).eq(i).attr("placeholder");
        } else if($(input).eq(i).prev().get(0) && $(input).eq(i).prev().get(0).tagName.toLowerCase() == "label") {
          placeholder = $(input).eq(i).prev().get(0).textContent;
          $(input).eq(i).prev().detach();
        }
        $(input).eq(i).attr("id", convId);
        $(input).eq(i).attr("placeholder", " ");
        var label = $("<label>" + placeholder + "</label>", {for : convId,class : "ng-binding"});
        $(input).eq(i).after(label.clone());
        $(input).eq(i).next().attr("for", convId);
      }
    }
  }, 500);
}

function initLabelTitle() {
  setTimeout(function(){
    var label = $(".pagecontent label");
    for(var i= 0; i < label.length; i++) {
      $(label).eq(i).attr("title", $(label).eq(i).text());
    }
  }, 500);
}

function uploadVaultFile(vault) {
  if (vault != null) {
    vault.uploader.send();
//    vault.data.upload();
  }
}

function initVaultComponent (id, callback, bOpenApi, exts) {
  var korean = {
    add: "파일추가",
    browse: "파일찾기",
    cancel: "취소",
    clear: "초기화",
    clearAll: "전체 초기화",
    download: "다운로드",
    dragAndDrop: "",
    filesOrFoldersHere: "여러 개의 첨부 파일을 마우스로 끌어놓으세요.",
    or: "",
    upload: ""
  };
  var sessionStorage = window.sessionStorage;
  var userkey = sessionStorage.getItem("userkey") + '-' + sessionStorage.getItem("loginTenantId");
  var iCheck = 0;

  var checkVaultInterval = setInterval(function() {
    if (iCheck > 10) {
      clearInterval(checkVaultInterval);
      return;
    }
    iCheck++;
    if($('#' + id).length > 0) {
      clearInterval(checkVaultInterval);
      var vault = new dhx.Vault(id, {
          mode: "list",
          uploader: {
              target: API_HTTP_PROTOCOL + "//" + API_SERVER_DOMAIN + ":" + API_SERVER_PORT + (bOpenApi? "/openapi": "") + "/attach/temp/upload.do?userkey=" + userkey,
              autosend: false
          }
      });

      var activeCheck = "mp3, mp4, doc, docx, xls, xlsx, ppt, pptx, hwp, pdf, txt, gul, jpg, gif, png, bmp, dib, tif, tiff, zip, alz, rar, 7z, mm, dwg, dxf";//확장자 제한
      if (exts) {
        activeCheck = exts;
      }
      var sizeLimit = 104857600; // 100mb 제한
      var filesCountValue = document.getElementById("files-count-value");
      var filesSizeValue = document.getElementById("files-size-value");
      var filesSizeText = document.getElementById("files-size-text");
      var maxUploadFileCnt = 20;
      var isErrMaxUploadFileCnt = false;
      vault.events.on("beforeAdd", function (item) {
        if (vault.data.getLength() >= maxUploadFileCnt) {
            if(!isErrMaxUploadFileCnt) {
              alert("파일 첨부는 최대 20개 까지만 가능합니다.");
              isErrMaxUploadFileCnt = true;
            }
            return false;
        }
        var extension = item.file.name.split(".").pop();
        var size = item.file.size;
        var predicate = activeCheck.indexOf(extension.toLowerCase()) > -1 && size < sizeLimit;
        if (!predicate) {
          alert(activeCheck + " 파일만 가능합니다.");
          var $obj = $(".dhx-dropable-area.drop-files-here");
          $obj.closest(".layout_y").removeClass('dhx-dragin');
        }
        return predicate;
      });
      vault.events.on("AfterAdd", function(item) {
        vault.toolbar.hide("upload");
      });

      vault.events.on("UploadFile", function (file) {
          //console.log(file);
          //alert(file.fileDuplication);
          //alert(file.file.name);
      });
      vault.events.on("uploadComplete", function (data) {
        if (data != null && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].responseVO != null) {
              var result = {};
              result.header = data[i].responseVO.header;
              result.body = data[i].responseVO.body;

              callback.onFileUploaded(id, result);
            }
          }
        }

        callback.onFileUploadComplete(id);
        vault.data.removeAll(); // 초기화
      });
      dhx.i18n.setLocale('vault', korean);

      if (callback)
        callback.onLoaded(id, vault);
    }
  }, 100);
}

function setBreakPoint(obj) {
  var size = ['xs', 'sm', 'md', 'lg', 'xl'];
  for(var i = 0; i < size.length; i++) {
    if(obj != "" && size[i] == obj) {
      obj =  "";
      for(var j = 0; j < i; j++) obj +=  size[j] + " ";
    }
  }
  return obj;
}


function initFootableEvent(vm, ft, callback) {
  var $el = ft.$el;
  var key = ft.o.key;
  var row = ft.o.rows;
  var $tr = $el.find("tbody tr");
  var link = ft.o.link;
  var srch = ft.o.srch;
  var FreeBoardId = ft.o.FreeBoardId;
  $tr.find("td").css("cursor", "pointer");
  for(var i = 0; i < $tr.length; i++) {
    $tr.eq(i).attr("data-key", row[i][key]);
    $tr.eq(i).attr("data-idx", i);
  }

  $tr.bind("click", function(){
    if( $(this).find(".footable-toggle").length == 0) {
      srch[key] = $(this).attr("data-key");
      var localStorage = window.localStorage;
      var dockMode = localStorage.getItem("dockMode");

      var type = {v: "vertical", h: "horizon", d: "default"};
      if(dockMode == null || dockMode== type.d) {
//        console.log(location.origin + "/#/app/bbspost/h0102-slist/" + encodeURIComponent(JSON.stringify(srch, replacer)) + "/detail/" + FreeBoardId);
        location.hash = "app/bbspost/h0102-slist/" + encodeURIComponent(JSON.stringify(srch, replacer)) + "/detail/" + FreeBoardId;
//        ft.o.ctrState.go(link, {srch : encodeURIComponent(JSON.stringify(srch, replacer)), FreeBoardId:FreeBoardId });
      } else {

       /*  var e ={}
        e.ft = ft;
        e.dockMode = dockMode;
        e.eventState = "click";
        callback(e); */
        var url = location.origin + "/#/app/bbspost/h0102-slist/" + encodeURIComponent(JSON.stringify(srch, replacer)) + "/" + FreeBoardId;
        if(dockMode == type.v) {

          $("#dockTop iframe").attr("src", url);
        } else {
          //console.log("clci");
          $("#dockbottom iframe").attr("src", url);
        }
      }
    }
  });
}

function setDockView($compile, $scope, mode, callback) {
  // mode 대신 필요한 정보를 object 형식으로 받을 수 있도록 수정 필요
  var setDocViewInterval = setInterval(function() {


    var $docWrap = $("#dockWrap");

    if($docWrap.length > 0) {

      var $docBackup = $("#dockBackupWrap");

      clearInterval(setDocViewInterval);
      var type = {v: "vertical", h: "horizon", d: "default"};
      var localStorage = window.localStorage;
      if(mode.type == null) localStorage.setItem("dockMode", "default");
      else localStorage.setItem("dockMode", mode.type);

      if($docBackup.length == 0) {
        $docWrap.after("<div id='dockBackupWrap'></div>");
        $docBackup = $("#dockBackupWrap");
        $docBackup.append($docWrap.children().clone(true, true, true));
      }
      var $docWrapChild = $docBackup.children().clone(true, true, true);
      $("#dockWrap").empty().html('');
      if(mode.type == null || mode.type == type.d) {
        //$("#dockWrap").append("<div id='dockLeft' dock=\"'left'\"><div class='dock-content'></div></div>");
      } else if(mode.type == type.v) {
        $("#dockWrap").append("<div id='dockLeft' dock=\"'left'\" dock-ref=\"\" dock-resizable ><div class='dock-content'></div></div>");
        $("#dockWrap").append("<div id='dockTop' dock=\"'fill'\" dock-ref=\"\" ><div class='dock-content'><iframe>리스트를 클릭하여주세요.</iframe></div></div>");


      } else {
       // $("#dockWrap").append("<div id='dockLeft' dock=\"'left'\" dock-resizable><div class='dock-content'></div></div>");

        $("#dockWrap").append("<div id='dockbottom' dock=\"'bottom'\" dock-resizable ><div class='dock-content'><iframe>리스트를 클릭하여주세요.</iframe></div></div>");
        $("#dockWrap").append("<div id='dockTop' dock=\"'fill'\" dock-ref=\"\"     ><div class='dock-content'></div></div>");

      }

      var $view = {l: $("#dockLeft"), t: $("#dockTop"), b: $("#dockbottom") };
      var offset = $docWrap.offset();
      var viewHeight =$(window).height() - (offset.top+5);
      if(mode.type == null || mode.type == type.d) {

      } else {

        //console.log(offset.top, $(window).height())

        $docWrap.css("height", viewHeight );
      }
      $docWrap.attr("dock-ref","");

      if(mode.type == null || mode.type == type.d) {
       /*  $view.l.css("width","100%");
        $view.l.css("height","100%"); */
      } else if(mode.type == type.v) {
        $view.l.css("width","50%");
        $view.t.css("height","100%");
      } else {
        $("#dockbottom").css("height",viewHeight/2);
      }

      $compile($docWrap)($scope);

      if(mode.type == null || mode.type == type.d) {
        //$("#dockLeft .dock-content").append($docWrapChild);
        $("#dockWrap").empty().html($docWrapChild);
      } else if(mode.type == type.v) {
        $("#dockLeft .dock-content").append($docWrapChild);
      } else {
        $("#dockTop .dock-content").append($docWrapChild);
      }

      callback();

    }
  }, 500);

}


/**
 * Null or Empty 검사
 * !value 하면 생기는 논리적 오류를 제거하기 위해 명시적으로 value == 사용 [], {} 도 빈값으로 처리
 * @param value - 검사할 값
 * @return true or false
 */
function isNullOrEmpty(value) {
  return value === "" || value === " " || value === '0.00' || value === null || value === undefined || (value != null && typeof value === "object" && !Object.keys(value).length);
}

/**
 * Email 검사
 * @param value - 검사할 값
 * @return true or false
 */
function isValidEmail(value) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(value);
}

/**
 * 날짜 검사
 * @param value - 검사할 값
 * @return true or false
 */
function isValidDate(value) {
  return value instanceof Date && !isNaN(value) && value != undefined;
}

function fnOpenLayer(width) {
  //console.log($(".search-detail-wrap"));

  var pos = $(".search_layer").offset();
  var h = $(".search_layer").height();

  setTimeout(function(){
    $(".search-detail-wrap").css("left", (pos.left) + 10);
    $(".search-detail-wrap").css("top", (pos.top) + 31);
    if (width) {
      $(".search-detail-wrap").css("width", width);
    }

    if ($(".search-detail-wrap").is(":visible")) {
      $(".search-detail-wrap").hide();
    } else {
      $(".search-detail-wrap").show();
    }
  }, 1);

  return false;
}

function fnCloseLayer() {
  $(".search-detail-wrap").hide();
  return false;
}

function date2str(x, y) {
  var z = {
      M: x.getMonth() + 1,
      d: x.getDate(),
      h: x.getHours(),
      m: x.getMinutes(),
      s: x.getSeconds()
  };
  y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
      return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2);
  });

  return y.replace(/(y+)/g, function(v) {
      return x.getFullYear().toString().slice(-v.length);
  });
}

function getSearchConditionStr(count, columnMap, srch) {
  var countStr = count? count : 0;

  var searchConditionStr = '<b>검색결과 <font color=red>' + Number(countStr).toLocaleString('en') + '</font>건</b> ';

  var str = [];
  for (var key in srch) {
    if (key == 'page' || key == 'viewSize' || key == 'tableNm' || key == 'sortDirect' || key == 'sortColumn' || key == 'userkey' || key == 'selectType' || key == 'srchTenantId')
      continue;

    var name = key;
    var value = srch[key];

    if (columnMap[key]) {
      name = columnMap[key].ColumnLogicalNm;

      if (columnMap[key].ColumnLogicalDataType == "50") {
        if (columnMap[key].CodeList) {
          columnMap[key].CodeList.forEach(function (v) {
            if (v.Code == value) {
              value = v.CodeValue;
              return;
            }
          });
        }
      }

      str.push(name + ':' + value);
    }
  }

  searchConditionStr += str.join(',');

  return searchConditionStr;
}

var Base64={
  _keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode:function(e)
  {
      var t="";
      var n,r,i,s,o,u,a;
      var f=0;
      e=Base64._utf8_encode(e);

      while(f<e.length)
      {
          n=e.charCodeAt(f++);
          r=e.charCodeAt(f++);
          i=e.charCodeAt(f++);
          s=n>>2;
          o=(n&3)<<4|r>>4;
          u=(r&15)<<2|i>>6;
          a=i&63;

          if(isNaN(r))
          {
              u=a=64;
          }
          else if(isNaN(i))
          {
              a=64;
          }

          t=t+this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
      }

      return t;
  },
  decode:function(e)
  {
      var t="";
      var n,r,i;
      var s,o,u,a;
      var f=0;
      e=e.replace(/[^A-Za-z0-9+/=]/g,"");

      while(f<e.length)
      {
          s=this._keyStr.indexOf(e.charAt(f++));
          o=this._keyStr.indexOf(e.charAt(f++));
          u=this._keyStr.indexOf(e.charAt(f++));
          a=this._keyStr.indexOf(e.charAt(f++));
          n=s<<2|o>>4;
          r=(o&15)<<4|u>>2;
          i=(u&3)<<6|a;
          t=t+String.fromCharCode(n);

          if(u!=64)
          {
              t=t+String.fromCharCode(r);
          }

          if(a!=64)
          {
              t=t+String.fromCharCode(i);
          }
      }

      t=Base64._utf8_decode(t);

      return t;
  },
  _utf8_encode:function(e)
  {
      e=e.replace(/rn/g,"n");
      var t="";

      for(var n=0;n<e.length;n++)
      {
          var r=e.charCodeAt(n);

          if(r<128)
          {
              t+=String.fromCharCode(r);
          }
          else if(r>127&&r<2048)
          {
              t+=String.fromCharCode(r>>6|192);
              t+=String.fromCharCode(r&63|128);
          }
          else
          {
              t+=String.fromCharCode(r>>12|224);
              t+=String.fromCharCode(r>>6&63|128);
              t+=String.fromCharCode(r&63|128);
          }
      }

      return t;
  },
  _utf8_decode:function(e)
  {
      var t="";
      var n=0;
      var r=c1=c2=0;

      while(n<e.length)
      {
          r=e.charCodeAt(n);
          if(r<128)
          {
              t+=String.fromCharCode(r);
              n++;
          }
          else if(r>191&&r<224)
          {
              c2=e.charCodeAt(n+1);
              t+=String.fromCharCode((r&31)<<6|c2&63);
              n+=2;
          }
          else
          {
              c2=e.charCodeAt(n+1);
              c3=e.charCodeAt(n+2);
              t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);
              n+=3;
          }
      }
      return t;
  }
};

function binary2text(encodedString) {
  var word;
  var agent = navigator.userAgent.toLowerCase();
  // IE old version ( IE 10 or Lower )
  if (navigator.appName == "Microsoft Internet Explorer") {
    console.log("Microsoft Internet Explorer (IE 10 or Lower)");
    word = "msie ";
    return Base64.decode(encodedString);
  } else if (agent.search("trident") > -1) {
    word = "trident/.*rv:";
  // Microsoft Edge
  } else if (agent.search("edge/") > -1) {
    word = "edge/";
  // 그외, IE가 아니라면 ( If it's not IE or Edge )
  } else {
  }

//  return atob(encodedString);

  return Base64.decode(encodedString);
}

function drawWordCloud(data, divId) {
  var weight = 3,   // change me
  width = $("#" + divId).width(),
  height = 300;

//  var data = [{text:'word', size:100},{text:'cloud', size:50},{text:'워드', size:50}];

  var fill = d3.scale.category20();
  d3.layout.cloud().size([width, height]).words(data)
    //.rotate(function() { return ~~(Math.random() * 2) * 90; })
    .rotate(0)
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();

  function draw(words) {
    d3.select("svg").selectAll("text")
      .style("font-size", function(d, i) { });

    d3.select("#" + divId)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
  }
}
