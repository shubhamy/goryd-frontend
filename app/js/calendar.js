app.controller('calendarCtrl', ['$scope', '$http', '$filter', 'MaterialCalendarData', '$sce', 'calenderShare', function($scope, $http, $filter, MaterialCalendarData, $sce, calenderShare) {
  httpConfig['Content-Type'] = 'application/json';

  $scope.dayFormatMain = 'd';
  $scope.selectedDateMain = [];
  $scope.firstDayOfWeekMain = 0;
  $scope.prevMonthMain = function(data) {
    $scope.msg = "You clicked (prev) month " + data.month + ", " + data.year;
  };
  $scope.nextMonthMain = function(data) {
    $scope.msg = "You clicked (next) month " + data.month + ", " + data.year;
  };
  $scope.dayClickMain = function(date) {
    $scope.msg = "You clicked " + $filter("date")(date, 'MMM d, y h:mm:ss a Z');
    calenderShare.setProperty($scope.selectedDateMain);
  };
  $scope.tooltipsMain = true;
}]);
