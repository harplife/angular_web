var API_HTTP_PROTOCOL = location.protocol;

/* Server
var API_SERVER_DOMAIN = '59.15.3.208';
var API_SERVER_PORT = '58080';
*/

/* Local */
var API_SERVER_DOMAIN = location.hostname;
var API_SERVER_PORT = location.hostname == 'localhost' ? '8080' : location.port;

if (location.hostname == "192.168.50.154") API_SERVER_PORT = 8080;

if (typeof webapp != "undefined" && webapp != null && webapp != "") {
  webapp.constant('GLOBAL_CONSTANT', {
    URL : {
      MAIL_PROTOCOL : 'mailto:',
      HTTP_PROTOCOL : location.protocol,
      PORT : API_SERVER_PORT,
      // API_SERVER_DOMAIN : 'api.sscrm.co.kr',
      //API_SERVER_DOMAIN :"192.168.50.93",
      API_SERVER_DOMAIN : API_SERVER_DOMAIN,
      CONTEXT : '',
      VERSION : ''
    },
    MENU_GBN : {
      HOME : 'HOME',
      MANAGE : 'MANAGE'
    },
    PAGINATION : {
      LISTSIZE: [10, 25, 50, 100],
      OPTION_VIEWSIZE : [ 4, 10, 25, 50, 100 ],
      VIEWSIZE : 10,
      MAXSIZE : 10
    },
    POPUP_PAGINATION : {
      LISTSIZE: [10, 25, 50, 100],
      OPTION_VIEWSIZE : [ 4, 10, 25 ],
      VIEWSIZE : 10,
      MAXSIZE : 10
    },
    LANG : {
      DEFAULT : 'ko',
      USE : [ 'en', 'ko', 'zh', 'ja' ],
      USE_NAME : [ {
        name : 'English',
        code : 'en'
      }, {
        name : '한국어',
        code : 'ko'
      }, {
        name : '简体字',
        code : 'zh'
      }, {
        name : '日本語',
        code : 'ja'
      } ],
    },
    HttpStatus : {
      OK : 200,
      BAD_REQUEST : 400,
      UNAUTHORIZED : 401,
      NOT_ACCEPTABLE : 406,
    },
    DATE : {
      FORMAT : {
        YYYYMMDD : 'yyyyMMdd'
      }
    },
    CODE_GROUP : {
      COLUMN_DATA_TYPE : '93',
      CUSTOMER_TYPE : '9',
      CUSTOMER_GRADE : '7',
      CUSTOMER_INFO_COGNITIONS : '8',
      CUSTOMER_INFO_CARE : '82',
      CUSTOMER_INFO_REFUSE : '83',
      CUSTOMER_INFO_ERROR : '84',
    }
  });
}
