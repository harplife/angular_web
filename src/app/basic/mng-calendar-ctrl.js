/**
 * @ngdoc function
 * @name app.basic:mng-calendar-ctrl
 * @description # 캘린더 설정
 * @param $window - window object
 * @param $scope - scope object
 * @param $location - location object
 * @param $state - state object
 * @param $stateParams - state Parameter object
 * @param CONSTANT - 전역 상수
 * @param $rootScope - rootscope object
 */
webapp.controller('MngCalendarCtrl', [ '$window', '$scope', '$location', '$state', '$stateParams', '$rootScope', '$translate', '$filter', 'GLOBAL_CONSTANT', 'modalFactory', 'postApi', 'gAlert', 'gConfirm',
    function MngCalendarCtrl($window, $scope, $location, $state, $stateParams, $rootScope, $translate, $filter, CONSTANT, modalWindow, postApi, gAlert, gConfirm) {
     // View Model
      var vm = this;

      if ($stateParams.srch == null || $stateParams.srch == '') {
        vm.srch = {
          TargetYear : String((new Date()).getFullYear()),
          TargetMonth : (new Date()).getMonth() + 1 < 10 ? '0' + String((new Date()).getMonth() + 1) : String((new Date()).getMonth() + 1),
        };
      } else {
        vm.srch = JSON.parse(decodeURIComponent($stateParams.srch));
      }

      vm.data = {};
      vm.getList = getList;
      vm.saveData = saveData;
      vm.getYearsList = getYearsList;
      vm.totalMonth = 12;
      vm.targetMonth = String((new Date()).getMonth() + 1);
      vm.strToday = moment(new Date()).format('YYYY-MM-DD');
      $scope.TargetMonth = vm.srch.TargetMonth;

      vm.date = new Date();
      vm.year = vm.srch.TargetYear;
      vm.month = vm.srch.TargetMonth;
      vm.yearMonth = vm.srch.TargetYear + "년 " + vm.srch.TargetMonth + "월";

      $scope.$watch('TargetMonth', function(current) {
        vm.srch.TargetMonth = current;
        getList();
      });

      $scope.$on('broadcastSetChangeTenantID', function(event, data) {
        getList();

        $rootScope.showSimpleToast($translate.instant('MSG.LISTUPDATED'));
      });

      function getList() {
        vm.dataloader = true;

        vm.lists2 = [];
        var data = vm.srch;
        data.mapCode = 'Calendar.getCalendarList';
        postApi.select(data, function(result){
          vm.dataloader = false;

          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              vm.data.lists = result.body.docs;

              var weeklyItem = {};
              angular.forEach(vm.data.lists, function(item, key) {
                if (item.CalDt == vm.strToday) {
                  item.isToday = 'Y';
                }

                switch (item.Day) {
                case 1:
                  weeklyItem = {};
                  weeklyItem.Sun = parseInt(item.Date);
                  weeklyItem.SunIndex = key;
                  break;
                case 2:
                  weeklyItem.Mon = parseInt(item.Date);
                  weeklyItem.MonIndex = key;
                  break;
                case 3:
                  weeklyItem.Tue = parseInt(item.Date);
                  weeklyItem.TueIndex = key;
                  break;
                case 4:
                  weeklyItem.Wed = parseInt(item.Date);
                  weeklyItem.WedIndex = key;
                  break;
                case 5:
                  weeklyItem.Thu = parseInt(item.Date);
                  weeklyItem.ThuIndex = key;
                  break;
                case 6:
                  weeklyItem.Fri = parseInt(item.Date);
                  weeklyItem.FriIndex = key;
                  break;
                case 7:
                  weeklyItem.Sat = parseInt(item.Date);
                  weeklyItem.SatIndex = key;
                  vm.lists2.push(weeklyItem);
                  weeklyItem = null;
                  break;
                }
              });
              if (weeklyItem != null) {
                vm.lists2.push(weeklyItem);
              }

              vm.data.TargetYear = vm.srch.TargetYear;
            }
          }
        }, function(error) {
          vm.dataloader = false;
          console.error('Error> getList> getCalendarList()', error);
        });
      }

      function getYearsList() {
        vm.dataLoader = true;

        var data = vm.srch;
        data.mapCode = 'Calendar.getYearsList';
        postApi.select(data, function(result){
          vm.dataloader = false;

          if (result.header.status === CONSTANT.HttpStatus.OK) {
            if (result.body.docs.length > 0) {
              vm.yearsList = result.body.docs;
              if (parseInt(vm.yearsList[vm.yearsList.length - 1].TargetYear) < (new Date()).getFullYear() + 1) {
                vm.yearsList.push({TargetYear:(new Date()).getFullYear() + 1});
              }
            } else {
              vm.yearsList = [{TargetYear:(new Date()).getFullYear()}, {TargetYear:(new Date()).getFullYear() + 1}];
            }
          }
        }, function(error) {
          vm.dataloader = false;
          console.error('Error> getYearsList> getYearsList()', error);
        });
      }

      vm.getDateClass = function(index) {
        if (vm.data.lists == null || vm.data.lists[index] == null)
          return '';

        if (vm.srch.TargetMonth != vm.data.lists[index].Month) {
          return 'gray';
        }

        if (vm.data.lists[index].isToday == 'Y')
          return 'title-header today';
        else if (vm.data.lists[index].HolidayYN == 'Y')
          return 'title-header text-danger';

        return 'title-header';
      };

      function saveData() {
        vm.dataLoader = true;

        var data = vm.data;
        data.mapCode = 'Calendar.insertCalendarBatch';
        postApi.update(data, function(result){
          vm.dataloader = false;

          if (result.header.status === CONSTANT.HttpStatus.OK) {
            gAlert('', '저장되었습니다.', {
              btn : '',
              fn : function() {
              }
            });
          } else {
            console.error(result.body.docs[0].errMessage);
            gAlert('', '저장되지 않았습니다.', {
              btn : '',
              fn : function() {
              }
            });
          }
        }, function(error) {
          vm.dataloader = false;
          console.error('Error> saveData()', error);
        });
      }

      // 오늘 버튼을 클릭하였을 경우
      $("button.fc-today-button").on('click', function() {
        if(!$('.fc-today-button').hasClass("fc-state-disabled")) {
          var curYear = String((new Date()).getFullYear());
          var curMonth = (new Date()).getMonth() + 1 < 10 ? '0' + String((new Date()).getMonth() + 1) : String((new Date()).getMonth() + 1);

          vm.year = curYear;
          vm.month = curMonth;

          vm.yearMonth = curYear + "년 " + curMonth + "월";
          vm.srch.TargetYear = curYear;
          vm.srch.TargetMonth = curMonth;

          getList();

          $('.fc-today-button').addClass('fc-state-disabled');
        }
      });

      // 왼쪽 버튼을 클릭하였을 경우
      $("button.fc-prev-button").on('click', function() {
        vm.month = parseInt(vm.month) - 1;

        if (vm.month == 0) {
          vm.year = parseInt(vm.year) - 1;
          vm.month = 12;
        }

        vm.yearMonth = vm.year + "년 " + vm.month + "월";
        vm.srch.TargetYear = vm.year;
        vm.srch.TargetMonth = vm.month;

        getList();

        var curYear = String((new Date()).getFullYear());
        var curMonth = (new Date()).getMonth() + 1 < 10 ? '0' + String((new Date()).getMonth() + 1) : String((new Date()).getMonth() + 1);

        if (curYear == vm.year && curMonth == vm.month) {
          $('.fc-today-button').addClass('fc-state-disabled');
        }
        else {
          $('.fc-today-button').removeClass('fc-state-disabled');
        }
      });

      // 오른쪽 버튼을 클릭하였을 경우
      $("button.fc-next-button").on('click', function() {
        vm.month = parseInt(vm.month) + 1;

        if (vm.month == 13) {
          vm.year = parseInt(vm.year) + 1;
          vm.month = 1;
        }

        vm.yearMonth = vm.year + "년 " + vm.month + "월";
        vm.srch.TargetYear = vm.year;
        vm.srch.TargetMonth = vm.month;

        getList();

        var curYear = String((new Date()).getFullYear());
        var curMonth = (new Date()).getMonth() + 1 < 10 ? '0' + String((new Date()).getMonth() + 1) : String((new Date()).getMonth() + 1);

        if (curYear == vm.year && curMonth == vm.month) {
          $('.fc-today-button').addClass('fc-state-disabled');
        }
        else {
          $('.fc-today-button').removeClass('fc-state-disabled');
        }
      });

      // getYearsList();
    }, ]);
