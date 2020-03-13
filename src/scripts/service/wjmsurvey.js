/* "use strict"; */
webapp.service('wjmSurvey',
  ['GLOBAL_CONSTANT', 'postApi', 'gAlert', '$filter', 'StaticVariable',
    function wjmSurvey(CONSTANT, postApi, gAlert, $filter, StaticVariable) {
      var vm = this;

      // 문항, 보기 갯수 제한
      vm.maxSvyPagesCnt = 100;
      vm.maxSvyQstsCnt = 500;
      vm.maxSvyQstItemsCntAll = 2000;
      vm.maxSvyQstItemsCnt = 20;

      // 문항,보기 기본 텍스트
      vm.txtQstSubject = "질문내용을 입력해주세요.";
      vm.txtQstSubjectR = "설명내용을 입력해주세요.";
      vm.txtQstItemContents = "답변내용을 입력해주세요.";

      // 문항 아이콘 설정
      vm.qstIcon1 = '<i class="glyphicon glyphicon-circle-arrow-right"></i>';
      vm.qstIcon2 = '<i class="glyphicon glyphicon-arrow-right"></i>';
      vm.qstIcon3 = '<i class="glyphicon glyphicon-chevron-right"></i>';
      vm.qstIcon4 = '<i class="glyphicon glyphicon-ok-circle"></i>';

      /**
       * 문항타입 텍스트 반환
       *
       * @param
       * @return
       */
      vm.getQstTypeNm = function(qstType) {
        var rtn = "";
        switch (qstType) {
          case "1": rtn = "[선택형]"; break;
          case "2": rtn = "[입력형]"; break;
          case "3": rtn = "[우선순위형]"; break;
          case "4": rtn = "[이미지형]"; break;
          case "C": rtn = "[분류정보]"; break;
          case "R": rtn = "[설명글]"; break;
          default: break;
        }

        return rtn;
      };

      /**
       * 관련코드생성
       *
       * @param
       * @return
       */
      vm.codeNo = 0;
      vm.getSvyCode = function(type, svyQsts, svyQstItems, isChkDup) {
        var code = "";
        var date = new Date();
        //var year = date.getFullYear();
        var month = new String(date.getMonth()+1);
        var day = new String(date.getDate());
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var uniNo = "";

        code = type;

        if (isNullOrEmpty(isChkDup)) isChkDup = true;
        uniNo = vm.getUniNo(isChkDup, ++vm.codeNo);

        if (month.length == 1) month = "0" + month;
        if(day.length == 1) day = "0" + day;
        if(hour.length == 1) hour = "0" + hour;
        if(minute.length == 1) minute = "0" + minute;
        if(second.length == 1) second = "0" + second;

        if (vm.codeS > 999999) vm.codeS = 0;

        // 중복체크 후 재생성
        if (isChkDup) {
          code += month + "" + day + "" + hour + "" + minute + "" + second + "" + uniNo;

          switch (type) {
            case "QT":
              if ($filter('filter')(svyQsts, {qtId: code}, true).length > 0) vm.getSvyCode(type, svyQsts, svyQstItems);
              break;

            case "IT":
              if ($filter('filter')(svyQstItems, {itId: code}, true).length > 0) vm.getSvyCode(type, svyQsts, svyQstItems);
              break;

            default :
              break;
          }
        }
        else {
          code += month + "" + day + "" + hour + "" + minute + "" + uniNo;
        }

        return code;
      };

      vm.getUniNo = function(isChkDup, codeNo) {
        var rtn = "";
        var no = "";

        if (isChkDup) {
          rtn += "" + Math.floor(Math.random() * (9));
          rtn += "" + Math.floor(Math.random() * (9));
          rtn += "" + Math.floor(Math.random() * (9));

          no = "000" + codeNo;
          rtn += no.slice(-3);
        }
        else {
          no = "000000" + codeNo;
          rtn = no.slice(-6);
        }

        return rtn;
      };

      /**
       * 관련번호초기화
       *
       * @param
       * @return
       */
      vm.initSvyNo = function(type, qtId, svyPages, svyQsts, svyQstItems) {
        var prevQtId = "";
        var qt = [];
        var it = [];
        var nPgNo = 0;
        var no = 0;
        var sort = 0;

        switch (type) {
          case "PG":
            svyPages.forEach(function(i, idx) {
              nPgNo = idx + 1;

              qt = $filter('filter')(svyQsts, {PageNo: i.PageNo}, true);
              qt.forEach(function(j) { j.PageNo = nPgNo });

              i.PageNo = nPgNo;
            });
            break;

          case "QT":
            svyQsts.sort( function( a, b ) { return (a.PageNo > b.PageNo) ? 1 : ((b.PageNo > a.PageNo) ? -1 : 0)} );

            svyQsts.forEach(function(i, idx) {
              sort = idx + 1;
              if (i.QstSort != sort) {
                i.stat = "U";
                i.QstSort = sort;
              }

              if (i.QstType != "R") {
                no++;
                if (i.QstNo != no) {
                  i.stat = "U";
                  i.QstNo = no;
                }
              }
            });
            break;

          case "IT":
            if (!isNullOrEmpty(qtId)) {
              it = $filter('filter')(svyQstItems, {qtId: qtId}, true);
              it.forEach(function(i, idx) {
                no = idx + 1;
                if (i.QstItemNo != no) {
                  i.stat = "U";
                  i.QstItemNo = no;
                }
              });
            }
            else {
              svyQstItems.forEach(function(i) {
                if (i.qtId != prevQtId) {
                  prevQtId = i.qtId;
                  no = 0;
                }

                no++;
                if (i.QstItemNo != no) {
                  i.stat = "U";
                  i.QstItemNo = no;
                }
              });
            }
            break;

          default : break;
        }
      };

      /**
       * 관련번호순정렬
       *
       * @param
       * @return
       */
      vm.sortSvyNo = function(type, qtId, svyPages, svyQsts, svyQstItems) {
        var it = [];

        switch (type) {
          case "PG":
            svyPages.sort( function( a, b ) { return (a.PageNo > b.PageNo) ? 1 : ((b.PageNo > a.PageNo) ? -1 : 0)} );
            break;

          case "QT":
            svyQsts.sort( function( a, b ) { return (a.QstSort > b.QstSort) ? 1 : ((b.QstSort> a.QstSort) ? -1 : 0)} );
            break;

          case "IT":
            if (isNullOrEmpty(qtId)) {
              it = $filter('filter')(svyQstItems, {qtId: qtId}, true);
              it.sort( function( a, b ) { return (a.QstItemNo > b.QstItemNo) ? 1 : ((b.QstItemNo > a.QstItemNo) ? -1 : 0)} );
            }
            break;

          default : break;
        }
      };

      /**
       * 문항이미지 목록
       * @param
       * @return
       * 주의: 해당함수를 커스덤하여 따로 쓰고있는 페이지가 존재함 (수정시 참고)
       */
      vm.getImageList = function(imageList, svyQsts, svyQstItems) {
        var data = {
          mapCode: 'WjmSurvey.getImageDropListConcat'
        };

        postApi.select(data, function (result) {
          if(result.header.status == CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {

              imageList = result.body.docs;

              vm.setImage(imageList, svyQsts, svyQstItems);
            }
          }
        }, function(error) {
          console.error('Error> getImageList()', status, error);
        });
      };

      /**
       * 문항, 보기이미지 경로 삽입
       * @param
       * @return
       */
      vm.setImage = function(imageList, svyQsts, svyQstItems) {
        var qt = [];
        var it = [];
        var img = [];

        qt = $filter('filter')(svyQsts, {QstType: "4"}, true);
        qt.forEach(function (i) {
          i.qtImgSrc = "";
          if (isNullOrEmpty(i.QstImgId)) return false;

          img = $filter('filter')(imageList, {AttachmentId: i.QstImgId}, true);
          //if (img.length > 0) i.qtImgSrc = StaticVariable.getUrl('/attach/file/' + img[0].PhysicalFileNm + '/download.do?userkey=' + $rootScope.gVariable.userKey);
          if (img.length > 0) i.qtImgSrc = StaticVariable.getUrl('/attach/file/' + img[0].PhysicalFileNm + '/download.do?userkey=');

          it = $filter('filter')(svyQstItems, {qtId: i.qtId}, true);
          it.forEach(function (j) {
            j.itImgSrc = "";
            if (isNullOrEmpty(j.QstItemImgId)) return false;

            img = $filter('filter')(imageList, {AttachmentId: j.QstItemImgId}, true);
            //if (img.length > 0) j.itImgSrc = StaticVariable.getUrl('/attach/file/' + img[0].PhysicalFileNm + '/download.do?userkey=' + $rootScope.gVariable.userKey);
            if (img.length > 0) j.itImgSrc = StaticVariable.getUrl('/attach/file/' + img[0].PhysicalFileNm + '/download.do?userkey=');
          });
        });
      };

      /**
       * 문항 아이콘 설정
       *
       * @param {string}
       * @return {boolean}
       */
      vm.getQstStyle = function (qstNo, QstIconType, QstNumYN) {
        var rtn = "";

        switch (QstIconType) {
          case "10": rtn += vm.qstIcon1 + " "; break;
          case "20": rtn += vm.qstIcon2 + " "; break;
          case "30": rtn += vm.qstIcon3 + " "; break;
          case "40": rtn += vm.qstIcon4 + " "; break;
          default : break;
        }

        if (QstNumYN == "Y") rtn += qstNo + ". ";

        return rtn;
      };
    }
  ]);
