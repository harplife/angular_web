(function() {
  "use strict";
  SurveyController.$inject = ['$scope', '$state', '$filter', '$rootScope', 'SurveyAPISrv', 'GLOBAL_CONSTANT', 'gAlert', '$window', '$translate','modalFactory', '$stateParams', 'StaticVariable', 'wjmSurvey'];

  /** @ngInject */
  function SurveyController($scope, $state, $filter, $rootScope, api, CONSTANT, gAlert, $window, $translate, modalFactory, $stateParams, StaticVariable, wjmSurvey) {
    var vm = this;

    //테스트 URL
    //http://localhost:3000/#/survey/6KWE5GM8YO/ZG3D62R5S

    //vm.data = {};
    vm.srch = {};
    vm.srch.SvyId = $stateParams.keyId;
    vm.srch.SvyTgtId = $stateParams.tgtId;
    vm.srch.respMode = isNullOrEmpty(vm.srch.SvyTgtId) ? "U" : "T";
    vm.isErr = false;
    vm.errMsg = "오류가 발생하였습니다.";

    // 설문관련 변수
    vm.svyInfo = [];
    vm.svyPages = [];
    vm.svyQsts = [];
    vm.svyQstItems = [];
    vm.svyPagesType = 1;
    vm.svyPagesTypeTxt = "소개글";
    vm.svyPagesCur = 1;
    vm.svyPagesTxt = "설문시작";
    vm.prevSvyPagesType = 0;

    // 기타
    vm.svyResps = [];
    vm.svyQstsCur = [];
    vm.beginQtId = "";
    vm.LvCont = "";

    $scope.wjmSurvey = wjmSurvey;

    if (!isNullOrEmpty(vm.srch.SvyId)) getData();
    else setErrMsg(true);

    /**
     * 현재 페이지 문항 설정
     *
     * @param {string}
     * @return {boolean}
     */
    vm.setQstsCur = function () {
      var k = 0;
      var qstsCur = [];
      var qt = [];

      if (!isNullOrEmpty(vm.beginQtId)) {
        qt = $filter('filter')(vm.svyQsts, {qtId: vm.beginQtId}, true)[0];
        if (!isNullOrEmpty(qt)) {
          vm.svyPagesCur = qt.PageNo;
          vm.svyPagesType = 2;
        }

        qstsCur = angular.copy($filter('filter')(vm.svyQsts, {PageNo: vm.svyPagesCur}, true));
        for (k = qstsCur.length - 1; k >= 0; k--) {
          if (parseInt(qstsCur[k].QstSort) < parseInt(qt.QstSort)) {
            qstsCur.splice(k, 1);
          }
        }
      }
      else {
        qstsCur = angular.copy($filter('filter')(vm.svyQsts, {PageNo: vm.svyPagesCur}, true));
      }

      vm.svyQstsCur = qstsCur;
      vm.beginQtId = "";
    };

    /**
     * 다음페이지 시작 문항 설정
     * 설명: 페이지에 문항중 다음 버튼을 눌렀을때 가야되는 분기는 최종적으로 하나이며,
     * 해당페이지에 복수의 분기가 설정된 경우 마지막으로 클릭한 문항, 마지막으로 클릭한 문항의 보기순으로 우선권을 가짐
     * @param {string}
     * @return {boolean}
     */
    vm.setBeginQtId = function (qt, it) {
      var itTmp = [];
      var isUseGoTo = false;

      if (!isNullOrEmpty(qt.GoToQstId)) {
        vm.beginQtId = qt.GoToQstId;
        return false;
      }

      if (!isNullOrEmpty(it.GoToQstId)) {
        vm.beginQtId = it.GoToQstId;
      }
      else {
        itTmp = $filter('filter')(vm.svyQstItems, {qtId: qt.qtId}, true);
        itTmp.forEach(function(i) {
          if (!isNullOrEmpty(i.GoToQstId)) {
            vm.beginQtId = "";
            return false;
          }
        });
      }
    };

    /**
     * 입력항목 체크
     * @param
     * @return
     */
    function getIsValidData() {
      var j = 0;
      var isPass = true;

      if (vm.svyInfo.QstPassYN == "Y") return true;

      vm.svyQstsCur.forEach(function(i) {
        if (i.QstType == "R") return true;

        if (isNullOrEmpty(vm.svyResps[i.qtId]) || vm.svyResps[i.qtId].length == 0) {
          isPass = false;
          return false;
        }

        if (i.QstType == "3") {
          if (i.QstTopCnt != Object.keys(vm.svyResps[i.qtId]).length) {
            isPass = false;
            return false;
          }

          for (j = 0; j < i.QstTopCnt; j++) {
            if (isNullOrEmpty(vm.svyResps[i.qtId][j])) {
              isPass = false;
              return false;
            }
          }
        }
        else if (i.QstType == "C" && i.ClassfyCd == "MB") {
          if (Object.keys(vm.svyResps[i.qtId]).length != 3
            || isNullOrEmpty(vm.svyResps[i.qtId][0])
            || isNullOrEmpty(vm.svyResps[i.qtId][1])
            || isNullOrEmpty(vm.svyResps[i.qtId][2])
          ) {
            isPass = false;
            return false;
          }
        }
        else if (i.QstType == "C" && i.ClassfyCd == "EM") {
          if (Object.keys(vm.svyResps[i.qtId]).length != 2
            || isNullOrEmpty(vm.svyResps[i.qtId][0])
            || isNullOrEmpty(vm.svyResps[i.qtId][1])
          ) {
            isPass = false;
            return false;
          }
        }
      });

      if (!isPass) {
        gAlert('', '응답하지 않은 문항이 존재합니다.');
      }

      return isPass;
    }

    /**
     * 페이지타입 변경
     *
     * @param {string}
     * @return {boolean}
     */
    vm.setSvyPagesType = function (type) {
      vm.prevSvyPagesType = vm.svyPagesType;

      switch (type) {
        case "PREV":
          if (vm.svyPagesType == 2) {
            if (vm.svyPagesCur == 1 || vm.svyPages.length == 0) vm.svyPagesType--;
            else vm.svyPagesCur--;
          }
          else if (vm.svyPagesType == 3) {
            vm.svyPagesType--;
            vm.svyPagesCur = vm.svyPages.length;
          }

          break;
        case "NEXT":
          if (vm.svyPagesType == 1) {
            vm.svyPagesType++;
          }
          else if (vm.svyPagesType == 2) {
            if (!getIsValidData()) return false;

            if (vm.srch.respMode == "T") {
              setTmpData();
              return false;
            }
            else vm.svyPagesCur++;
          }
          break;
        case "END":
          if (vm.svyPagesType == 2) {
            if (!getIsValidData()) return false;
            if (Object.keys(vm.svyResps).length == 0) {
              gAlert('', '응답한 문항이 없습니다. 최소 한개이상의 문항에 응답해주세요.');
              return false;
            }

            setTgtData();
            return false;
          }

          vm.svyPagesType++;
          break;
        default : break;
      }

      vm.setSvyPagesTypeNext();
    };

    /**
     * 페이지타입 변경 후처리
     *
     * @param {string}
     * @return {boolean}
     */
    vm.setSvyPagesTypeNext = function() {

      // 현재페이지 내용 삽입
      if (vm.prevSvyPagesType == 2) {
        vm.setQstsCur();
      }

      // 상단 설문타입 텍스트 설정
      switch (vm.svyPagesType) {
        case 1: vm.svyPagesTypeTxt = "소개글"; break;
        case 2: vm.svyPagesTypeTxt = "문항"; break;
        case 3: vm.svyPagesTypeTxt = "끝맺음말"; break;
        default: break;
      }

      // 상단 페이지 텍스트 설정
      if (vm.svyPagesType == 1) {
        vm.svyPagesTxt = "설문시작";
      }
      else if (vm.svyPagesType == 2) {
        vm.svyPagesTxt = vm.svyPagesCur + " / " + vm.svyPages.length + " 페이지 진행중";
      }
      else if (vm.svyPagesType == 3) {
        vm.svyPagesTxt = "설문완료";
      }

      //console.log("vm.svyQsts", vm.svyQsts);
      //console.log("vm.svyQstItems", vm.svyQstItems);
      //console.log("vm.svyResps", vm.svyResps);
    };

    /**
     * 설문버튼 상태변경
     *
     * @param {string}
     * @return {boolean}
     */
    vm.showSvyBtn = function (type) {
      var rtn = false;

      switch (type) {
        case "PREV":
          if (!vm.isUseGotoPage && vm.svyPagesType == 2) rtn = true;
          break;
        case "NEXT":
          if (
            vm.svyPagesType == 1
            || (vm.svyPagesType == 2 && vm.svyPagesCur != vm.svyPages.length && vm.svyPages.length != 0)
          ) rtn = true;
          break;
        case "END":
          if (vm.svyPagesType == 2 && (vm.svyPagesCur == vm.svyPages.length || vm.svyPages.length == 0)) rtn = true;
          break;
        default : break;
      }

      return rtn;
    };

    /**
     * 해당 설문에서 분기 사용여부 체크
     *
     * @param {string}
     * @return {boolean}
     */
    function setIsUseGotoPage() {
      var rtn = false;
      // 필터로 체크되지 않아서 반복문으로 체크
      /*
      if ($filter('filter')(vm.svyQsts, {GoToQstId: '!'}, true).length > 0
        || $filter('filter')(vm.svyQstItems, {GoToQstId: '!'}, true).length > 0
      ) vm.isUseGotoPage = true;
      */
      vm.svyQsts.forEach(function (i) {
        if (!isNullOrEmpty(i.GoToQstId)) {
          rtn = true;
          return false;
        }
      });

      if (!rtn) {
        vm.svyQstItems.forEach(function (i) {
          if (!isNullOrEmpty(i.GoToQstId)) {
            rtn = true;
            return false;
          }
        });
      }

      vm.isUseGotoPage = rtn;
    }

    /**
     * 페이지 추가
     *
     * @param {string}
     * @return {boolean}
     */
    vm.setSvyPageAdd = function () {
      var nextPgNo = vm.svyPages.length + 1;

      if (vm.svyPages.length > wjmSurvey.maxSvyPagesCnt) {
        gAlert('', "더이상 페이지를 만들 수 없습니다.");
        return false;
      }

      vm.svyPages.push({PageNo: nextPgNo});
      //vm.svyPagesCur = nextPgNo;
    };

    /**
     * 화면에러 상태 변경
     * @param
     * @return
     */
    function setErrMsg(isErr, errMsg) {
      vm.isErr = isErr;
      vm.errMsg = isNullOrEmpty(errMsg) ? "오류가 발생하였습니다." : errMsg;
    }

    /**
     * 설문가능 여부 조회
     * @param
     * @return
     */
    function getChkSurvey() {
      var prms;
      var rtn = [];
      var today = moment(new Date()).format('YYYYMMDD');
      var fromDt = moment(vm.svyInfo.SvyBeginDate).format('YYYYMMDD');
      var toDt = moment(vm.svyInfo.SvyEndDate).format('YYYYMMDD');

      var param = angular.copy(vm.srch);
      param.TargetCnt = vm.svyInfo.TargetCnt;
      param.RespLimitYN = vm.svyInfo.RespLimitYN;

      prms = api.getSurveyRespHistCheck().post(param).$promise;
      prms.then(function(data) {
        if (data && data.responseVO && data.responseVO.header.status == CONSTANT.HttpStatus.OK) {
          if (data.responseVO.body.docCnt > 0) {
            rtn = data.responseVO.body.docs[0];
            if (vm.svyInfo.SvyStatus != "2") {
              setErrMsg(true, "진행중인 설문이 아닙니다.");
              return false;
            }

            if (rtn.DupYN == "Y") {
              setErrMsg(true, "이미 응답한 설문입니다.");
              return false;
            }

            if (rtn.LimitYN == "Y") {
              setErrMsg(true, "응답건수가 마감된 설문입니다.");
              return false;
            }

            if (today < fromDt || today > toDt) {
              setErrMsg(true, "기간이 만료되었거나 시작전인 설문입니다.");
              return false;
            }
          }
        } else {
          console.error("Error> getChkSurvey()");
        }
      }, function (error) {
        console.error("Error> getChkSurvey()");
        console.table(error);
      });
    }

    /**
     * 기존응답데이터 조회
     * @param
     * @return
     */
    function getRespHistTmpList() {
      var prms;
      var param = angular.copy(vm.srch);
      var rtn = [];
      var it = [];
      var nextPg = 1;

      prms = api.getSurveyRespHistTmpList().post(param).$promise;
      prms.then(function(data) {
        if (data && data.responseVO && data.responseVO.header.status == CONSTANT.HttpStatus.OK) {
          if (data.responseVO.body.docCnt > 0) {
            gAlert("", "기존에 작성중인 응답데이터가 존재하여 해당화면으로 이동합니다.", {
              btn: "",
              fn: function () {
                //console.log("rtn", data.responseVO.body.docs[0]);
                //console.log("vm.svyResps", vm.svyResps);
                vm.svyResps = [];
                rtn = data.responseVO.body.docs;

                vm.svyQsts.forEach(function(i) {
                  it = $filter('filter')(rtn, {SvyQstId: i.SvyQstId}, true);

                  if (it.length > 0) {
                    if (nextPg < i.PageNo) nextPg = i.PageNo;

                    it.forEach(function (j, idx) {
                      vm.svyResps[i.SvyQstId] = [];
                      if (!isNullOrEmpty(j.PrioNo)) {
                        vm.svyResps[i.SvyQstId][j.PrioNo - 1] = j.SvyQstItemId;
                      }
                      else {
                        if (!isNullOrEmpty(j.SvyQstItemId)) {
                          vm.svyResps[i.SvyQstId][idx] = j.SvyQstItemId;
                        }
                        else if (!isNullOrEmpty(j.SbjctResp)) {
                          vm.svyResps[i.SvyQstId][idx] = j.SbjctResp;
                        }
                        else if (!isNullOrEmpty(j.ObjctResp)) {
                          vm.svyResps[i.SvyQstId][idx] = j.ObjctResp;
                        }
                      }
                    });
                  }
                });

                vm.svyPagesType = 2;
                vm.svyPagesCur = nextPg;
                vm.prevSvyPagesType = 2;
                vm.setSvyPagesTypeNext();
              }
            });
          }
        } else {
          console.error("Error> getRespHistTmpList()");
        }
      }, function (error) {
        console.error("Error> getRespHistTmpList()");
        console.table(error);
      });
    }

    /**
     * 데이터 조회
     * @param
     * @return
     */
    function getData() {
      var i = 0;
      var prms;
      var param = angular.copy(vm.srch);

      param.keyId = vm.srch.SvyId;

      prms = api.getSurveyDetail().post(param).$promise;
      prms.then(function(data) {
        if (data && data.responseVO && data.responseVO.header.status == CONSTANT.HttpStatus.OK) {
          if (data.responseVO.body.docCnt > 0) {
            vm.svyInfo = data.responseVO.body.docs[0];

            if (!isNullOrEmpty(vm.svyInfo["no data"])) {
              setErrMsg(true);
            }
            else {
              if (!isNullOrEmpty(vm.svyInfo.PageCnt)) {
                for (i = 0; i < parseInt(vm.svyInfo.PageCnt); i++) vm.setSvyPageAdd();
                //vm.svyPagesCur = 1;
              }

              getChkSurvey();
              getDataQsts();
            }
          }
        } else {
          console.error("Error> getData()");
          /*
          if (!isNullOrEmpty(data.responseVO.body.docs)) {
            gAlert('', data.responseVO.body.docs[0].errMessage);
          }
          */
        }
      }, function (error) {
        console.error("Error> getData()");
        console.table(error);
      });
    }

    /**
     * 데이터 조회 (문항)
     * @param
     * @return
     */
    function getDataQsts() {
      var prms = api.getSurveyQstDetail().post(vm.srch).$promise;

      prms.then(function(data) {
        if (data && data.responseVO && data.responseVO.header.status == CONSTANT.HttpStatus.OK) {
          if (data.responseVO.body.docCnt > 0) {
            vm.svyQsts = data.responseVO.body.docs[0].list;

            getDataQstItems();
          }
        } else {
          console.error("Error> getDataQst()");

          /*
         if (!isNullOrEmpty(data.responseVO.body.docs)) {
           gAlert('', data.responseVO.body.docs[0].errMessage);
         }
         */
        }
      }, function (error) {
        console.error("Error> getDataQst()");
        console.table(error);
      });
    }

    /**
     * 데이터 조회 (보기)
     * @param
     * @return
     */
    function getDataQstItems() {
      var prms = api.getSurveyQstItemDetail().post(vm.srch).$promise;

      prms.then(function(data) {
        if (data && data.responseVO && data.responseVO.header.status == CONSTANT.HttpStatus.OK) {
          if (data.responseVO.body.docCnt > 0) {
            vm.svyQstItems = data.responseVO.body.docs[0].list;
          }

          setIsUseGotoPage();
          vm.svyQstsCur = $filter('filter')(vm.svyQsts, {PageNo: vm.svyPagesCur}, true); // 현재 페이지의 문제 데이터 (분기처리를 위함)

          getImageList();

          if (vm.srch.respMode == "T") getRespHistTmpList();
        } else {
          console.error("Error> getDataQstItems()");

          /*
         if (!isNullOrEmpty(data.responseVO.body.docs)) {
           gAlert('', data.responseVO.body.docs[0].errMessage);
         }
         */
        }

      }, function (error) {
        console.error("Error> getDataQstItems()");
        console.table(error);
      });
    }

    /**
     * 문항이미지 목록
     * @param
     * @return
     */
    function getImageList() {
      var prms = api.getImageDropListConcat().post(vm.srch).$promise;

      prms.then(function(data) {
        if (data && data.responseVO && data.responseVO.header.status == CONSTANT.HttpStatus.OK) {
          if (data.responseVO.body.docCnt > 0) {
            vm.imageList = data.responseVO.body.docs[0].list;
            setImage();
          }
        } else {
          console.error("Error> getImageList()");

          /*
         if (!isNullOrEmpty(data.responseVO.body.docs)) {
           gAlert('', data.responseVO.body.docs[0].errMessage);
         }
         */
        }

      }, function (error) {
        console.error("Error> getImageList()");
        console.table(error);
      });
    }

    /**
     * 문항, 보기이미지 경로 삽입
     * @param
     * @return
     */
    function setImage() {
      var qt = [];
      var it = [];
      var img = [];

      qt = $filter('filter')(vm.svyQsts, {QstType: "4"}, true);
      qt.forEach(function (i) {
        i.qtImgSrc = "";
        if (isNullOrEmpty(i.QstImgId)) return false;

        img = $filter('filter')(vm.imageList, {AttachmentId: i.QstImgId}, true);
        //if (img.length > 0) i.qtImgSrc = StaticVariable.getUrl('/attach/file/' + img[0].PhysicalFileNm + '/download.do?userkey=' + $rootScope.gVariable.userKey);
        if (img.length > 0) i.qtImgSrc = StaticVariable.getUrl('/attach/file/' + img[0].PhysicalFileNm + '/download.do?userkey=');

        it = $filter('filter')(vm.svyQstItems, {qtId: i.qtId}, true);
        it.forEach(function (j) {
          j.itImgSrc = "";
          if (isNullOrEmpty(j.QstItemImgId)) return false;

          img = $filter('filter')(vm.imageList, {AttachmentId: j.QstItemImgId}, true);
          //if (img.length > 0) j.itImgSrc = StaticVariable.getUrl('/attach/file/' + img[0].PhysicalFileNm + '/download.do?userkey=' + $rootScope.gVariable.userKey);
          if (img.length > 0) j.itImgSrc = StaticVariable.getUrl('/attach/file/' + img[0].PhysicalFileNm + '/download.do?userkey=');
        });
      });
    }

    /**
     * 미니결과 조회
     * @param
     * @return
     */
    function getMiniResult() {
      var prms;
      var param = angular.copy(vm.srch);

      param.SvyTypeId = vm.svyInfo.SvyTypeId;

      prms = api.getMiniResultDetail().post(param).$promise;
      prms.then(function(data) {
        if (data && data.responseVO && data.responseVO.header.status == CONSTANT.HttpStatus.OK) {
          console.log("data.responseVO.body", data.responseVO.body);
          if (data.responseVO.body.docCnt > 0) {
            if (!isNullOrEmpty(vm.svyInfo["no data"])) {
              vm.LvCont = "관련된 미니결과표가 없습니다.";
            }
            else {
              vm.LvCont = data.responseVO.body.docs[0].LvCont;
            }
          }
          else {
            vm.LvCont = "관련된 총점데이터 또는 미니결과표가 없습니다.";
          }
        } else {
          console.error("Error> getMiniResult()");
          /*
          if (!isNullOrEmpty(data.responseVO.body.docs)) {
            gAlert('', data.responseVO.body.docs[0].errMessage);
          }
          */
        }
      }, function (error) {
        console.error("Error> getMiniResult()");
        console.table(error);
      });
    }

    /**
     * 설문대상자 생성
     * @param
     * @return
     */
    function setTgtData() {
      var prms;
      var param = angular.copy(vm.srch);

      if (vm.srch.respMode == "T") {
        setData();
        return false;
      }

      prms = api.insertSurveyTarget().post(param).$promise;
      prms.then(function(data) {
        if (data && data.responseVO && data.responseVO.header.status == CONSTANT.HttpStatus.OK) {
          if (data.responseVO.body.docCnt > 0) {
            vm.srch.SvyTgtId = data.responseVO.body.docs[0].RelateDataId;

            setData();
          }
        } else {
          console.error("Error> setTgtData()");
        }
      }, function (error) {
        console.error("Error> setTgtData()");
        console.table(error);
      });
    }

    /**
     * 임시 응답데이터 저장
     * @param
     * @return
     */
    function setTmpData() {
      var prms;
      var param = angular.copy(vm.srch);

      param.SvyTypeId = vm.svyInfo.SvyTypeId;
      param.insertData = getRespDataArr();

      if (param.insertData.length > 0) {
        prms = api.updateSurveyRespHistTmp().post(param).$promise;
        prms.then(function (data) {
          if (data && data.responseVO && data.responseVO.header.status == CONSTANT.HttpStatus.OK) {
            if (data.responseVO.body.docCnt > 0) {
              vm.svyPagesCur++;
              vm.setSvyPagesTypeNext();
            }
          } else {
            console.error("Error> setTmpData()");
          }
        }, function (error) {
          console.error("Error> setTmpData()");
          console.table(error);
        });
      }
      else {
        vm.svyPagesCur++;
        vm.setSvyPagesTypeNext();
      }
    }

    /**
     * 응답 저장
     * @param
     * @return
     */
    function setData() {
      var prms;
      var param = angular.copy(vm.srch);

      param.SvyTypeId = vm.svyInfo.SvyTypeId;
      param.insertData = getRespDataArr();

      prms = api.updateSurveyRespHist().post(param).$promise;
      prms.then(function(data) {
        if (data && data.responseVO && data.responseVO.header.status == CONSTANT.HttpStatus.OK) {
          if (data.responseVO.body.docCnt > 0) {
            getMiniResult();
          }

          vm.svyPagesType++;
          vm.prevSvyPagesType = 2;
          vm.setSvyPagesTypeNext();
        } else {
          console.error("Error> setData()");
        }
      }, function (error) {
        console.error("Error> setData()");
        console.table(error);
      });
    }

    /**
     * 응답 저장
     * @param
     * @return
     */
    function getRespDataArr() {
      var k = 0;
      var data = [];

      vm.svyQsts.forEach(function(i) {
        if (!isNullOrEmpty(vm.svyResps[i.qtId])) {
          if (i.QstType == "2") {
            data.push({
              SvyQstId: i.qtId,
              SvyQstItemId: "",
              ObjctResp: "",
              SbjctResp: vm.svyResps[i.qtId][0],
              PrioNo: ""
            });
          }
          else if (i.QstType == "3") {
            for (k = 0; k < Object.keys(vm.svyResps[i.qtId]).length; k++) {
              data.push({
                SvyQstId: i.qtId,
                SvyQstItemId: vm.svyResps[i.qtId][k],
                ObjctResp: "",
                SbjctResp: "",
                PrioNo: k + 1
              });
            }
          }
          else if (i.QstType == "C" && i.ClassfyCd == "MB") {
            data.push({
              SvyQstId: i.qtId,
              SvyQstItemId: "",
              ObjctResp: "",
              SbjctResp: vm.svyResps[i.qtId][0] + "-" + vm.svyResps[i.qtId][1] + "-" + vm.svyResps[i.qtId][2],
              PrioNo: ""
            });
          }
          else if (i.QstType == "C" && i.ClassfyCd == "EM") {
            data.push({
              SvyQstId: i.qtId,
              SvyQstItemId: "",
              ObjctResp: "",
              SbjctResp: vm.svyResps[i.qtId][0] + "@" + vm.svyResps[i.qtId][1],
              PrioNo: ""
            });
          }
          else if (i.QstType == "C" && i.ClassfyCd == "GD") {
            data.push({
              SvyQstId: i.qtId,
              SvyQstItemId: "",
              ObjctResp: vm.svyResps[i.qtId][0],
              SbjctResp: "",
              PrioNo: ""
            });
          }
          else {
            data.push({
              SvyQstId: i.qtId,
              SvyQstItemId: vm.svyResps[i.qtId][0],
              ObjctResp: "",
              SbjctResp: "",
              PrioNo: ""
            });
          }
        }
      });

      return data;
    }
  }

  webapp.component("survey", {
    transclude: true,
    bindings: {},
    controller: SurveyController,
    controllerAs: "survey",
    templateUrl: "components/survey/survey.html"
  });
})();
