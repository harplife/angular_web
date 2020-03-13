/* "use strict"; */
webapp.service('customFieldApi', ['$resource', 'StaticVariable', '$rootScope', '$filter',
  function customFieldApi($resource, StaticVariable, $rootScope, $filter) {
    /**
     * * Noti
     *   - 호출 타입
     *     * customFieldApi 내 type 참고
    **/
    var translate = $filter('translate');

    var customFieldApi = {
      setReadOnlyUdcColumns : function(allColumns) {
        var udcColumns = [];
        // var udcCols = vm.allColumns.filter(x => x.CustomColumnYN == 'Y');
        var udcCols = allColumns.filter(function(x) {
          return x.CustomColumnYN == 'Y';
        });
        // for (var i = 0; i < udcCols.length; i += 4){
        var row = {};
        row.className = 'row';
        row.fieldGroup = [];

        for (var j = 0; j < udcCols.length; j++) {
          var item = {};

          if (udcCols[j] !== undefined) {
            item.key = udcCols[j].ColumnPhysicalNm;
            item.className = udcCols[j].EditColumnWidth;

            item.type = 'readOnly';

            item.templateOptions = {};
            item.templateOptions.label = udcCols[j].ColumnLogicalNm;

            row.fieldGroup.push(item);
          }
        }

        // 등록/수정 대상 사용자정의 컬럼 정보
        udcColumns.push(row);

        return udcColumns;
      },
      setEditableUdcColumns : function(allColumns) {
        var udcColumns = [];
        //      var udcCols = vm.allColumns.filter(x => x.CustomColumnYN === 'Y');
        var udcCols = allColumns.filter(function(x) {
          return x.CustomColumnYN === 'Y';
        });

        // row당 4개의 컬럼 표시
        var row = {};
        row.className = 'row';
        row.fieldGroup = [];

        for (var j = 0; j < udcCols.length; j++) {

          var item = {};
          if (udcCols[j] !== undefined) {
            item.key = udcCols[j].ColumnPhysicalNm;
            item.className = udcCols[j].EditColumnWidth+' form-right';
            console.log('udcCols : ',udcCols[j].EditColumnWidth);
            item.type = 'input';

            item.templateOptions = {};
            item.templateOptions.label = udcCols[j].ColumnLogicalNm;

            //TODO: 데이터 유형에 따라서 type을 다르게 처리 필요
            // 10-text, 20-number, 30-number(float), 40-date, 50-select
            console.log(udcCols[j]);
            switch (udcCols[j].ColumnPhysicalDataType) {
            case '20':
              item.templateOptions.type = 'number';
              item.templateOptions.placeholder = '{숫자만 입력하세요.}';
              break;
            case '30':
              item.templateOptions.type = 'number';
              item.templateOptions.placeholder = '{숫자만 입력하세요.}';
              break;
            case '40':
              item.templateOptions.type = 'text';
              item.templateOptions.placeholder = '{년-월-일}';
              break;
            case '50':
              item.type = 'select';
              item.templateOptions.valueProp = 'abbr';
              item.templateOptions.labelProp = 'name';
              item.templateOptions.options = [];

              var items = [{name:'--'+translate('Menu.CHOOSE')+'--',abbr:''}];

              if (udcCols[j].CodeKey != null && udcCols[j].CodeValue != null) {
                var codeValues = udcCols[j].CodeValue.split(',');
                var codeKeys = udcCols[j].CodeKey.split(',');

                codeValues.forEach(function(codeRow, key) {
                  var code = {};
                  code.name = codeRow;
                  code.abbr = codeKeys[key];
                  items.push(code);
                });
              } else  if (udcCols[j].ColumnCodeValue.length > 0) {
                var codeValues = udcCols[j].ColumnCodeValue.split(',');

                codeValues.forEach(function(codeRow) {
                  var code = {};
                  code.name = codeRow;
                  code.abbr = codeRow;
                  items.push(code);
                });
              }

              item.templateOptions.options = items;

              break;
            default:
              item.templateOptions.type = 'text';
              break;
            }

            row.fieldGroup.push(item);
          }
        }
        // 등록/수정 대상 사용자정의 컬럼 정보
        udcColumns.push(row);

        return udcColumns;
      },
    };
    return customFieldApi;
  },
]);
