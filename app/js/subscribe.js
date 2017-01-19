app.controller('home.subscribe', ['$scope', '$http', '$q','$mdToast', function($scope, $http, $q,$mdToast) {
  httpConfig['Content-Type'] = 'application/json';
    $scope.name = "";
    $scope.phone = "";
    $scope.email = "";
    $scope.userOptions = ['I am a Renter', 'I am a Car owner', 'Both'];
    $scope.isRenter = $scope.userOptions[0];
    $scope.thanks = false;
    $scope.subscribeUser = subscribeUser;

    function subscribeUser() {
        $scope.errorMessage = null;
        $scope.successMessage = null;
        $scope.thanks = true;
        return $http({
            url: URL_PREFIX + '/api/support/subscribe/',
            method: 'POST',
            data: {
                'email': $scope.email
                // 'name': $scope.name,
                // 'phone': $scope.phone,
                // 'isOwner': $scope.userOptions.indexOf($scope.isRenter)
            },
            headers: httpConfig
        }).then(function(response) {
          $mdToast.show(
            $mdToast.simple()
            .textContent("Thank you for subscribing. Please check your inbox for our e-mail.")
            .hideDelay(5000)
            .position('top right')
          );
            // $scope.successMessage = "Thank you for subscribing. Please check your inbox for our e-mail.";
            // return response.status;
        }, function(error) {
            if (error.status == 400) {
              $mdToast.show(
                $mdToast.simple()
                .textContent("You're already subscribed.")
                .hideDelay(5000)
                .position('top right')
              );
                // $scope.errorMessage = "You're already subscribed.";
            } else {
              $mdToast.show(
                $mdToast.simple()
                .textContent("Oops,Something is wrong.")
                // .parent(document.querySelectorAll('#toaster'))
                .hideDelay(5000)
                .position('top right')
              );
                // $scope.errorMessage = "Internal server error.";
            }
            // return error;
        });
    }
}]);
