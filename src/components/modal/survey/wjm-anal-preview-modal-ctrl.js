webapp.controller('WjmAnalPreviewModalCtrl', [ '$uibModalInstance', 'toModalData','$filter',
    function WjmAnalPreviewModalCtrl($uibModalInstance, toModalData, $filter) {
      var vm = this;
      vm.cancel = cancel;
      vm.getData = getData;

      vm.TgtCnt = toModalData.TgtCnt;
      vm.tgtList = toModalData.tgtList;
      vm.dataType = toModalData.dataType;

      vm.chtList = [];

      var useScale = (vm.dataType.typeChtCd != "pie" && vm.dataType.typeChtCd != "doughnut");
      var useStack = (vm.dataType.typeChtCd == "stackedBar");
      var useLegend = (vm.dataType.typeChtCd == "pie" || vm.dataType.typeChtCd == "doughnut" || vm.dataType.typeChtCd == "stackedBar");

      // 차트 초기화
      vm.chart = {
        dataList : [],
        class : "chart-" + vm.dataType.typeChtCd,
        type : (vm.dataType.typeChtCd == "stackedBar" ? "bar" : vm.dataType.typeChtCd),
        data : [],
        series : [],
        labels : [],
        colors : [],
        options : {
          legend : {
            display : useLegend,
            position : 'left'
          },
          scales: {
            yAxes: [{
              display : useScale,
              ticks: {min: 0},
              stacked: useStack,
            }],
            xAxes: [{
              display : useScale,
              ticks: {min: 0},
              stacked: useStack,
            }]
          },
          elements : {
            line: { fill: false }
          },
        }
      };


      function getData(){

        var first = -1;

        // 차트 데이터 조회
        angular.forEach(vm.dataType.chtList, function(c, idx) {
          var cht = angular.copy(vm.chart);
          cht.dataList = c.dataList;
          cht.cntTot = c.cntTot;
          cht.title = c.title;

          if(first == -1 && c.cntTot > 0) first = idx; // 분류정보별 진단결과 차트의 경우 맨 처음 차트에만 범례 표시

          if( ! isNullOrEmpty(c.title)) cht.options.title = { display: true, text: c.title };
          if(useLegend && vm.dataType.chtType == "L" && vm.dataType.cfCd != "") {
            cht.options.legend.display = (first == idx);
          }

          vm.chtList.push(cht);
        });

        var hx = "";

        // 차트에 매핑
        angular.forEach(vm.chtList, function(c) {

          var dt = [];
          var sr = [];
          var lb = [];
          var cr = [];

          angular.forEach(c.dataList, function(d) {

            hx = "";
            switch(d.Type){
              case "Green" : hx = "#6DDB59"; break;
              case "Blue" : hx = "#235FF5"; break;
              case "Yellow" : hx = "#F5E523"; break;
              case "Red" : hx = "#E4355A "; break;
            }

            if(vm.dataType.typeChtCd == "stackedBar") {
              dt.push([d.Cnt]);
              sr.push([d.Type]);
              if(hx != "") cr.push([hx]);
              lb = ["전체"];
            }
            else {
              dt.push(d.Cnt);
              lb.push(d.Type);
              if(hx != "") cr.push(hx);
            }
          });

          c.data = dt;
          c.series = sr;
          c.labels = lb;
          c.colors = cr;
        });
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel data');
      }

      getData();

    } ]);

