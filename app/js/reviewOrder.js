app.controller('reviewOrder', ['$scope', '$http','$mdDialog','reviewCar','indexShare','$mdToast', function($scope, $http,$mdDialog,reviewCar,indexShare,$mdToast) {
  httpConfig['Content-Type'] = 'application/json';

    $scope.reviewBooking = reviewCar.getProperty()[0];
    $scope.rating = 5;
    var isCust = indexShare.getProperty().flag;
    if (isCust == 'customer') {
        $scope.customer = true;
    } else {
        $scope.customer = false;
    }
    $scope.reviewResponse = "Very Good!";
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
    $scope.reviewSubmit = function(c, r) {
        if(c===undefined){
          c= '';
        }
        var ratingsent = r;
        var bookingpk = indexShare.getProperty().pk;
        var datatosend = {
            comment: c,
            rating: ratingsent
        };
        $http({
            method: 'PUT',
            url: URL_PREFIX + '/api/booking/review/'+ bookingpk+ '/',
            data: datatosend,
            headers: httpConfig
        }).then(function(response) {
          $mdDialog.cancel();
          $mdToast.show(
            $mdToast.simple()
            .textContent("Thanks")
            .hideDelay(3000)
            .position('top right')
          );
        },function(error){
          $mdDialog.cancel();
          $mdToast.show(
            $mdToast.simple()
            .textContent("Error, please try again later!")
            .hideDelay(3000)
            .position('top right')
          );
        });
    };
}]);
