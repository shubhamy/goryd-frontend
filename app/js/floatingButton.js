app.controller('floatingButton', ['$scope', '$mdSidenav', '$http', '$q','$mdToast','$window', function sideNavController($scope, $mdSidenav, $http, $q,$mdToast,$window) {
  httpConfig['Content-Type'] = 'application/json';
    $scope.rating = 5;
    $scope.reviewResponse = "Please rate us";
    $scope.flagstart = true;
    $scope.$watch('rating', function(newValue, oldValue) {
        if (!$scope.flagstart) {
            if ($scope.rating == 1) {
                $scope.reviewResponse = " Very Bad";
            }
            if ($scope.rating == 2) {
                $scope.reviewResponse = "Bad";
            }
            if ($scope.rating == 3) {
                $scope.reviewResponse = "Average";
            }
            if ($scope.rating == 4) {
                $scope.reviewResponse = "Good";
            }
            if ($scope.rating == 5) {
                $scope.reviewResponse = "Awesome!";
            }
        } else {
            $scope.flagstart = false;
        }
    });
    $scope.isTooltipOpen = true;

    $scope.openLeftMenu = function() {
        $mdSidenav('left').toggle();
    };

    $scope.openRightMenu = function() {
        $scope.isTooltipOpen = false;
        $mdSidenav('right').toggle();
        $http({
            url: URL_PREFIX + '/api/users/profile/?mode=self',
            method: 'GET',
            headers: httpConfig
        }).then(function(response) {
            $scope.user = response.data;
            $scope.name1 = response.data.user.first_name;
        }, function(error) {
            $scope.user = null;
            $scope.name1 = "";
        });
    };

    $scope.feedback = "";
    $scope.thanks = false;
    $scope.submit = submit;

    function submit() {
      $scope.isTooltipOpen = false;
        return $http({
            url: URL_PREFIX + '/api/support/feedback/',
            method: 'POST',
            data: {
                name: $scope.name1,
                message: $scope.feedback,
                rating: $scope.rating
            },
            headers: httpConfig
        }).then(function(response) {
            $scope.thanks = true;
        },function(error){
          if(error.status==400){
            $mdToast.show(
              $mdToast.simple()
              .textContent("Error, please fill the all required details")
              .hideDelay(3000)
              .position('top right')
            );
          }else{
            $mdToast.show(
              $mdToast.simple()
              .textContent("Error, please try again later!")
              .hideDelay(3000)
              .position('top right')
            );
          }
          return;
        });
    }
}]);
