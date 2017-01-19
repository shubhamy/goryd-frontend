app.controller('home', ['$scope', '$http', '$state', '$rootScope', '$mdBottomSheet', '$mdToast', function($scope, $http, $state, $rootScope, $mdBottomSheet, $mdToast) {
  httpConfig['Content-Type'] = 'application/json';

    var timeIndex = null;
    $scope.place = null;
    $scope.time = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'];
    $scope.time1 = $scope.time.slice(new Date(Date.now()).getHours()-5);
    $scope.time2 = $scope.time;
    $scope.t1 = START_TIME === null ? $scope.time1[0] : START_TIME;
    $scope.t2 = END_TIME === null ? $scope.time[$scope.time.length - 1] : END_TIME;
    $scope.minDate = new Date(Date.now());
    $scope.d1 = START_DATETIME === null ? new Date(Date.now()) : START_DATETIME;
    $scope.sDate = $scope.d1;
    $scope.d2 = END_DATETIME === null ? new Date(Date.now() + 24 * 3600 * 1000) : END_DATETIME;
    $scope.searchPlace = SEARCH_LOCATION === null ? '' : SEARCH_LOCATION;
    if (new Date(Date.now()).getHours()>22){
      $scope.time1 = $scope.time;
      $scope.t1 = $scope.time1[0];
      $scope.d1 = new Date(Date.now() + 24 * 3600 * 1000);
      $scope.sDate = $scope.d1;
      $scope.minDate= $scope.d1;
    }
    else if(new Date(Date.now()).getHours()<6){
      $scope.time1 = $scope.time;
      $scope.t1 = $scope.time1[0];
    }
    stringToDate = function(date, time_string) {
        dateTime = date;
        time = time_string.split(":");
        time[1] = time[1].split(" ");
        if (time[1][1] == "PM" && time[0] !== "12") {
            time[0] = parseInt(time[0]) + 12;
        }
        dateTime.setHours(time[0]);
        dateTime.setMinutes(time[1][0]);
        return dateTime;
    };
    $scope.placeChanged = function() {
        $scope.place = this.getPlace();
    };
    $scope.$watch('d1', function(newValue, oldValue) {
      $scope.sDate = $scope.d1;
      if(newValue>oldValue){
        document.getElementById('timeStart').click();
      }
      if((newValue.getDate()==$scope.minDate.getDate())&&(newValue.getMonth()==$scope.minDate.getMonth())&&(newValue.getYear()==$scope.minDate.getYear())){
        if(new Date(Date.now()).getHours()<6){
          $scope.time1 = $scope.time;
          $scope.t1 = $scope.time1[0];
        }else if(new Date(Date.now()).getHours()>22){
          $scope.time1 = $scope.time;
          $scope.t1 = $scope.time1[0];
        }
        else{
          $scope.time1 = $scope.time.slice(new Date(Date.now()).getHours()-5);
        }
      }else{
        $scope.time1 = $scope.time;
      }
      var nd = new Date($scope.d1);
      $scope.flagd2=true;
      if(newValue>oldValue && newValue>$scope.d2){
        var nextDay = new Date($scope.d1);
        $scope.flagd2 = false;
        nd.setDate(nextDay.getDate()+1);
        $scope.d2 = nd;
        $scope.time2 = $scope.time;
        $scope.t2 = $scope.time2[$scope.time2.length - 1];
      }
      if(newValue<=oldValue){
          $scope.time2 = $scope.time;
      }else if((newValue.getDate()==$scope.d2.getDate())&&(newValue.getMonth()==$scope.d2.getMonth())&&(newValue.getYear()==$scope.d2.getYear())){
        var index = $scope.time.indexOf($scope.t1);
        $scope.time2 = $scope.time.slice(index+1);
        $scope.t2 = $scope.time2[$scope.time2.length - 1];
      }
    });
      $scope.$watch('t1', function(newValue, oldValue) {
        if(($scope.d1.getDate()==$scope.d2.getDate())&&($scope.d1.getMonth()==$scope.d2.getMonth())&&($scope.d1.getYear()==$scope.d2.getYear())){
          var index = $scope.time.indexOf(newValue);
          $scope.time2 = $scope.time.slice(index+1);
          $scope.t2 = $scope.time2[$scope.time2.length - 1];
        }
        if(newValue == '11:00 PM'){
          var nd = new Date($scope.d1);
          var nextDay = new Date($scope.d1);
          nd.setDate(nextDay.getDate()+1);
          $scope.sDate = nd;
          $scope.d2 = nd;
          $scope.time2 = $scope.time;
          $scope.t2 =  $scope.time2[0];
        }
      });
      $scope.$watch('d2', function(newValue, oldValue) {
        if($scope.flagd2&&newValue!=oldValue){
          document.getElementById('timeEnd').click();
        }
        if((newValue.getDate()==$scope.d1.getDate())&&(newValue.getMonth()==$scope.d1.getMonth())&&(newValue.getYear()==$scope.d1.getYear())){
          var index = $scope.time.indexOf($scope.t1);
          $scope.time2 = $scope.time.slice(index+1);
          $scope.t2 = $scope.time2[$scope.time2.length - 1];
        }else if(newValue>oldValue){
            $scope.time2 = $scope.time;
        }
      });
    $scope.updateSearchParams = function() {
      if(stringToDate($scope.d1, $scope.t1)>stringToDate($scope.d2, $scope.t2)){
        $mdToast.show(
            $mdToast.simple()
            .textContent('Invalid dates. Pickup time must be  less than dropTime!')
            .hideDelay(3000)
            .position('top right')
        );
        return;
      }
        if ($scope.searchPlace === '') {
            $mdToast.show(
                $mdToast.simple()
                .textContent('Please tell us your pickup location!')
                .hideDelay(3000)
                .position('top right')
            );
            return;
        } else {
            START_TIME = $scope.t1;
            END_TIME = $scope.t2;
            START_DATETIME = stringToDate($scope.d1, $scope.t1);
            END_DATETIME = stringToDate($scope.d2, $scope.t2);
            if ($scope.place !== null) {
                SEARCH_LOCATION = $scope.place.formatted_address;
                SEARCH_LOCATION_COORDINATES = $scope.place.geometry.location;
            }
            if ($state.is('list')) {
                $mdBottomSheet.hide();
            }
            $state.go('list');
            $rootScope.$broadcast('updateSearchParams', {});
        }
    };
}]);
