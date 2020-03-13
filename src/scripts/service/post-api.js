/* "use strict"; */
webapp.service('postApi', ['$resource', 'StaticVariable', '$rootScope', '$window', '$http',
  function postApi($resource, StaticVariable, $rootScope, $window, $http) {
    /**
     * * Noti
     *   - 사용방법 예시
     *     * postApi.get('namespace.method', data, function(){});
     *     * postApi.get(data, function(){});
     *     * postApi.get(data, callbackFnc);
     *       > function callbackFnc() {}
     *
     *      var data = {mapCode : 'Role.getRoleList'};
     *      postApi.get(data, function(result){
     *        console.log("type B", result);
     *      });
     *      var data = {};
     *      postApi.get('Role.getRoleList', data, function(result){
     *        console.log("type C", result);
     *      });
     *      var data = {};
     *      postApi.get('Role.getRoleList', data, callback);
     *      function callback(result) {
     *        console.log("type D", result);
     *      }
     *
     *   - 호출 타입
     *     * postApi 내 type 참고
    **/

    var postApi = {
      type : {
        select : "select", insert : "insert", update : "update", delete : "delete",
        action : "action", attach : "attach", excel : "excel", api : "api",
        openApi : "openapi", login : "login",
      },
      makeData : function(D) {
        if($window.sessionStorage["loginTenantId"] != "" && $window.sessionStorage["loginTenantId"] != null && $window.sessionStorage["loginTenantId"] != undefined){
          D.userkey = $rootScope.gVariable.userKey;
        }
        if ($window.sessionStorage['loginSysAdminYN'] == "Y") {
          D.srchTenantId = $rootScope.gVariable.srchTenantId;
        }
        return D;
      },
      makeErrorMsg : function(errorType) {
        var result = {};
        if(errorType == "undefinedSqlMap") result.header = {status:405, msg: "This service requires a 'mapCode' key for data."};
        result.body = {};
        console.error(result.header);
        return result;
      },
      makeResultData : function(D){
        var result = {};
        if (D == null || D.responseVO == null) return result;
        result.header = D.responseVO.header;
        result.body = D.responseVO.body;
        return result;
      },
      getMapCode : function(D) {
        var obj = {result : false, mapcode : ""};
        for( var key in D )
          if(key.toLowerCase() == "mapcode") {
            obj.result = true;
            obj.mapcode =  D[key];
            obj.data = D;
            delete obj.data.mapCode;
          }
        return obj;
      },
      sendPost : function(p1, p2, p3, callback, callback2) {
        $resource(StaticVariable.getUrl('/'+ p1 +'/' + p2  + '/action.json'), {userkey:$rootScope.gVariable.userKey},
        StaticVariable.getRequestActions.defaultAction()).post(this.makeData(p3)).$promise.then(function (data) {
          callback(postApi.makeResultData(data), p2);
        }, function(error) {
          callback2(error, p2);
        });
      },
      sendPostOpen : function(p1, p2, p3, callback, callback2) {
        $resource(StaticVariable.getUrl('/'+ p1 +'/' + p2  + '.json'), {},
        StaticVariable.getRequestActions.defaultAction()).post(this.makeData(p3)).$promise.then(function (data) {
          callback(postApi.makeResultData(data));
        }, function(error) {
          callback2(error);
        });
      },
      sendPostCustom : function(p1, p2, p3, callback, callback2) {
        $resource(StaticVariable.getUrl('/'+ p1 +'/' + p2  + '/actionCustom.json'), {userkey:$rootScope.gVariable.userKey},
        StaticVariable.getRequestActions.defaultAction()).post(this.makeData(p3)).$promise.then(function (data) {
          callback(postApi.makeResultData(data));
        }, function(error) {
          callback2(error);
        });
      },
      sendPostApi : function(p1, p2, p3, callback, callback2) {
        $resource(StaticVariable.getUrl('/'+ p1 +'/' + p2  + '.json'), {userkey:$rootScope.gVariable.userKey},
        StaticVariable.getRequestActions.defaultAction()).post(this.makeData(p3)).$promise.then(function (data) {
          callback(postApi.makeResultData(data));
        }, function(error) {
          callback2(error);
        });
      },
      login : function(p1, p2, callback, callback2) {
        if(typeof p1 == "string") {
            this.sendPostOpen(this.type.login, p1, p2, function(data){ callback(data); }, function(data){ callback2(data); });
        } else {
          var code = this.getMapCode(p1);
          if(code.result) {
            this.sendPostOpen(this.type.login, code.mapcode, code.data, function(data){ p2(data); },function(data){ callback(data); });
          } else p2(postApi.makeErrorMsg("undefinedSqlMap"));
        }
      },
      select : function(p1, p2, callback, callback2) {
        if(Array.isArray(p1)) {
          // HJH GJ - 20200103 멀티 Select를 할 수 있는 환경 추가
          // postApi.select(data, function(result) {});
          // data 가 배열일 경우 해당 루트를 타게됨
          // data 구조 = [{mapCode: "map1", param: data},{mapCode: "map1", param: data}];
          // 기존과 다르게 mapCode 명시 - 같은 파라메터를 넘길 수 있음으로 mapCode가 key 값을 가지게 됨
          for(var i = 0; i < p1.length; i++) {
            this.sendPost(this.type.select, p1[i].mapCode, p1[i].param, function(data, mapCode){ data.mapCode = mapCode; p2(data); });
          }

        } else {
          if(typeof p1 == "string") {
              this.sendPost(this.type.select, p1, p2, function(data){ callback(data); }, function(data){ callback2(data); });
          } else {
            var code = this.getMapCode(p1);
            if(code.result) {
              this.sendPost(this.type.select, code.mapcode, code.data, function(data){ p2(data); },function(data){ callback(data); });
            } else p2(postApi.makeErrorMsg("undefinedSqlMap"));
          }
        }
      },
      callbackSelect : function(p1, p2, tempData, callback, callback2) {
        if(typeof p1 == "string") {
            this.sendPost(this.type.select, p1, p2, function(data){ callback(data, tempData); }, function(data){ callback2(data, tempData); });
        } else {
          var code = this.getMapCode(p1);
          if(code.result) {
            this.sendPost(this.type.select, code.mapcode, code.data, function(data){ p2(data, tempData); },function(data){ callback(data, tempData); });
          } else p2(postApi.makeErrorMsg("undefinedSqlMap"));
        }
      },
      selectCustom : function(p1, p2, callback, callback2) {
        if(typeof p1 == "string") {
            this.sendPostCustom(this.type.select, p1, p2, function(data){ callback(data); }, function(data){ callback2(data); });
        } else {
          var code = this.getMapCode(p1);
          if(code.result) {
            this.sendPostCustom(this.type.select, code.mapcode, code.data, function(data){ p2(data); },function(data){ callback(data); });
          } else p2(postApi.makeErrorMsg("undefinedSqlMap"));
        }
      },
      insert : function(p1, p2, callback, callback2) {
        if(typeof p1 == "string") {
            this.sendPost(this.type.insert, p1, p2, function(data){ callback(data); }, function(data){ callback2(data); });
        } else {
          var code = this.getMapCode(p1);
          if(code.result) {
            this.sendPost(this.type.insert, code.mapcode, code.data, function(data){ p2(data); },function(data){ callback(data); });
          } else callback2(postApi.makeErrorMsg("undefinedSqlMap"));
        }
      },
      update : function(p1, p2, callback, callback2) {
        if(typeof p1 == "string") {
            this.sendPost(this.type.update, p1, p2, function(data){ callback(data); }, function(data){ callback2(data); });
        } else {
          var code = this.getMapCode(p1);
          if(code.result) {
            this.sendPost(this.type.update, code.mapcode, code.data, function(data){ p2(data); },function(data){ callback(data); });
          } else p2(postApi.makeErrorMsg("undefinedSqlMap"));
        }
      },
      delete : function(p1, p2, callback, callback2) {
        if(typeof p1 == "string") {
            this.sendPost(this.type.delete, p1, p2, function(data){ callback(data); }, function(data){ callback2(data); });
        } else {
          var code = this.getMapCode(p1);
          if(code.result) {
            this.sendPost(this.type.delete, code.mapcode, code.data, function(data){ p2(data); },function(data){ callback(data); });
          } else p2(postApi.makeErrorMsg("undefinedSqlMap"));
        }
      },
      action : function(p1, p2, callback, callback2) {
        if(typeof p1 == "string") {
            this.sendPost(this.type.action, p1, p2, function(data){ callback(data); }, function(data){ callback2(data); });
        } else {
          var code = this.getMapCode(p1);
          if(code.result) {
            this.sendPost(this.type.action, code.mapcode, code.data, function(data){ p2(data); },function(data){ callback(data); });
          } else p2(postApi.makeErrorMsg("undefinedSqlMap"));
        }
      },
      attach : function(p1, p2, callback, callback2) {
        if(typeof p1 == "string") {
            this.sendPost(this.type.attach, p1, p2, function(data){ callback(data); }, function(data){ callback2(data); });
        } else {
          var code = this.getMapCode(p1);
          if(code.result) {
            this.sendPost(this.type.attach, code.mapcode, code.data, function(data){ p2(data); },function(data){ callback(data); });
          } else p2(postApi.makeErrorMsg("undefinedSqlMap"));
        }
      },
      excel : function(p1, p2, callback, callback2) {
        if(typeof p1 == "string") {
            this.sendPost(this.type.excel, p1, p2, function(data){ callback(data); }, function(data){ callback2(data); });
        } else {
          var code = this.getMapCode(p1);
          if(code.result) {
            this.sendPost(this.type.excel, code.mapcode, code.data, function(data){ p2(data); },function(data){ callback(data); });
          } else p2(postApi.makeErrorMsg("undefinedSqlMap"));
        }
      },
      excelFile : function(p1, p2, p3, callback, callback2) {
        var url = null;
        var data = {};
        var finleNm;
        var cal1, cal2;
        if (typeof p1 == "string") {
          url = StaticVariable.getUrl('/'+ this.type.excel +'/' + p1  + '.json');

          if (typeof p2 == "string") {
            if(p2.indexOf("xls") != -1 || p2.indexOf("xlsx") != -1) {
              fileNm = p2;
            } else {
              fileNm = p2 + ".xlsx"
            }
            data = p3;
            cal1 = callback;
            cal2 = callback2;
          } else {
            fileNm = "";
            data = p2;
            cal1 = p3;
            cal2 = callback;
          }
        } else {
          var code = this.getMapCode(p1);
          if (code.result) {
            url = StaticVariable.getUrl('/'+ this.type.excel +'/' + code.mapcode  + '.json');
            data = p1;
          } else {
            p2(postApi.makeErrorMsg("undefinedSqlMap"));
            return;
          }

          if (p1.fileNm != undefined) {
            if (p1.fileNm.indexOf("xls") != -1 || p1.fileNm.indexOf("xlsx") != -1) {
              fileNm = p1.fileNm;
            } else {
              fileNm = p1.fileNm + ".xlsx";
            }
          } else {
            fileNm = "";
          }

          cal1 = p2;
          cal2 = p3;
        }
        var temp = {};
        temp = this.makeData(temp)
        url += "?userkey=" + temp.userkey;
        $http({
          method: 'POST',
          url: url,
          data: data,
          responseType: 'arraybuffer',
        }).success(function(data, status, headers, config) {
          var linkElement = document.createElement('a');
          try {
            var blob = new Blob([data], { type: "application/octet-stream" });
            var url = window.URL.createObjectURL(blob);

            if (fileNm == "") {
              var urls = url.split("/");
              fileNm = urls[urls.length-1] + ".xlsx";
            }
            linkElement.setAttribute('href', url);
            linkElement.setAttribute("download", fileNm);
            var clickEvent = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "cancelable": false
            });
            linkElement.dispatchEvent(clickEvent);
            if(cal1 != undefined) {
                cal1(data)
            }
          } catch (ex) {
            if(cal2 != undefined) {
              cal2(ex)
            }
          }
        }).error(function (data) {
          if(cal2 != undefined) {
            cal2(data)
          }
        });
      },
      api : function(p1, p2, callback, callback2) {
        if(typeof p1 == "string") {
            this.sendPostApi(this.type.api, p1, p2, function(data){ callback(data); }, function(data){ callback2(data); });
        } else {
          var code = this.getMapCode(p1);
          if(code.result) {
            this.sendPostApi(this.type.api, code.mapcode, code.data, function(data){ p2(data); },function(data){ callback(data); });
          } else p2(postApi.makeErrorMsg("undefinedSqlMap"));
        }
      },
      openApi : function(p1, p2, callback, callback2) {
        if(typeof p1 == "string") {
          this.sendPostOpen(this.type.openApi, p1, p2, function(data){ callback(data); }, function(data){ callback2(data); });
        } else {
          var code = this.getMapCode(p1);
          if(code.result) {
            this.sendPostOpen(this.type.openApi, code.mapcode, code.data, function(data){ p2(data); },function(data){ callback(data); });
          } else p2(postApi.makeErrorMsg("undefinedSqlMap"));
        }
      },
      ajax : {
        get : function(p1, p2, callback) {
          if(typeof p1 == "string") postApi.ajax.sendAjax(postApi.type.select, p1, p2, function(data){ callback(data); });
          else {
            var code = postApi.getMapCode(p1);
            (code.result) ? postApi.ajax.sendAjax(postApi.type.select, code.mapcode, code.data, function(data){ p2(data); })
            : p2(postApi.makeErrorMsg("undefinedSqlMap"));
          }
        },
        set : function(p1, p2, callback) {
          if(typeof p1 == "string") postApi.ajax.sendAjax(postApi.type.insert, p1, p2, function(data){ callback(data); });
          else {
            var code = postApi.getMapCode(p1);
            (code.result) ? postApi.ajax.sendAjax(postApi.type.insert, code.mapcode, code.data, function(data){ p2(data); })
            : p2(postApi.makeErrorMsg("undefinedSqlMap"));
          }
        },
        upt : function(p1, p2, callback) {
          if(typeof p1 == "string") postApi.ajax.sendAjax(postApi.type.update, p1, p2, function(data){ callback(data); });
          else {
            var code = postApi.getMapCode(p1);
            (code.result) ? postApi.ajax.sendAjax(postApi.type.update, code.mapcode, code.data, function(data){ p2(data); })
            : p2(postApi.makeErrorMsg("undefinedSqlMap"));
          }
        },
        del : function(p1, p2, callback) {
          if(typeof p1 == "string") postApi.ajax.sendAjax(postApi.type.delete, p1, p2, function(data){ callback(data); });
          else {
            var code = postApi.getMapCode(p1);
            (code.result) ? postApi.ajax.sendAjax(postApi.type.delete, code.mapcode, code.data, function(data){ p2(data); })
            : p2(postApi.makeErrorMsg("undefinedSqlMap"));
          }
        },
        sendAjax : function(type, sqlmap, data, callback) {
          if(data == undefined) data = {};
          var url = "/"  + type + "/" + sqlmap + "/action.json"
          if(sqlmap.indexOf(".json") > -1) url = "/"  + type + "/" + sqlmap;
          data.userkey = $rootScope.gVariable.userKey;
          if ($window.sessionStorage['loginSysAdminYN'] == "Y" && !data.srchTenantId) {
            data.srchTenantId = $window.sessionStorage['srchTenantId'];
          }
          url = StaticVariable.getUrl(url);
          url = url + "?" +$rootScope.gVariable.userKey;
          var reciveJsonData = null;
          $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            async: false,
            crossDomain: true,
            beforeSend : function(xhr){},
            success: function(result){callback(reciveJsonData)},
            error: function(jqXHR, textStatus, errorThrown) {}
          });
        }
      }
    };
    return postApi;
  },
]);
