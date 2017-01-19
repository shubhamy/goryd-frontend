app.config(function($stateProvider, $locationProvider) {

    $stateProvider
        .state('accounts.profile', {
            url: "/profile",
            templateUrl: 'templates/accounts.profile.html',
            controller: 'accounts.profile'
        });
    $stateProvider
        .state('accounts.requested', {
            url: "/requested",
            templateUrl: 'templates/accounts.requested.html',
            controller: 'accounts.requested'
        });
    $stateProvider
        .state('accounts.ongoing', {
            url: "/ongoing",
            templateUrl: 'templates/accounts.ongoing.html',
            controller: 'accounts.ongoing'
        });
    $stateProvider
        .state('accounts.completed', {
            url: "/completed",
            templateUrl: 'templates/accounts.completed.html',
            controller: 'accounts.completed'
        });
    $stateProvider
        .state('accounts.contactUs', {
            url: "/contactUs",
            templateUrl: 'templates/accounts.contactus.html',
            controller: 'accounts.contactUs'
        });
    $stateProvider
        .state('accounts.sendMail', {
            url: "/sendMail",
            templateUrl: 'templates/accounts.sendMail.html',
            controller: 'accounts.sendMail'
        });
});
app.controller('accounts.requested', ['$scope', '$cookies', '$http', '$q', '$mdSidenav', '$stateParams','$mdToast','$window','indexShare','$state',function($scope, $cookies, $http, $q, $mdSidenav, $stateParams,$mdToast, $window,indexShare,$state) {
  httpConfig['Content-Type'] = 'application/json';
    $http({
        method: 'GET',
        url: URL_PREFIX + '/api/booking/mybooking/?status=requested',
        headers: httpConfig
    }).then(function(response) {
        $scope.bookings = response.data;
    },function(error){
      $mdToast.show(
        $mdToast.simple()
        .textContent('Error, please try again later!')
        .hideDelay(3000)
        .position('top right')
      );
    });
    $scope.bookingRequest = {};
    $scope.bookingCancel = function(i) {
        $scope.bookings[i].status = 'cancelled';
        $scope.bookingRequest = angular.copy($scope.bookings[i]);
        var data1 = {
          bookingId : $scope.bookingRequest.bookingId,
          status: 'cancelled'
        };
        $http({
            method: 'PUT',
            url: URL_PREFIX + '/api/booking/mybooking/' + $scope.bookingRequest.pk + '/',
            data: data1,
            headers: httpConfig
        }).
        then(function(response) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('You cancelled the request.')
            .hideDelay(3000)
            .position('top right')
          );
          $window.setTimeout(function(){location.reload();},3000);
        },function(error){
          if(error.status==403){
            $mdToast.show(
              $mdToast.simple()
              .textContent(error.data.error)
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
            // $window.location.reload();
          // return;
      });
        $scope.bookingCard = true;
    };

}]);

app.controller('accounts.ongoing', ['$scope', '$http', '$q', '$mdSidenav', '$stateParams','indexShare','$state',function($scope, $http, $q, $mdSidenav, $stateParams,indexShare,$state) {
  httpConfig['Content-Type'] = 'application/json';
    $scope.rating = 5;
    $scope.review = '';
    $http({
        method: 'GET',
        url: URL_PREFIX + '/api/booking/mybooking/?status=approved',
        headers: httpConfig
    }).then(function(response) {
        $scope.bookings = response.data;
    });
    $scope.pay = function(i){
      $scope.payRequest = angular.copy($scope.bookings[i]);
      indexShare.setProperty($scope.payRequest);
      $state.go('payment');
    };
    $scope.bookingCancel = function(i) {
        $scope.bookings[i].status = 'cancelled';
        $scope.bookingUpcoming = angular.copy($scope.bookings[i]);
        var data1 = {
          bookingId : $scope.bookingUpcoming.bookingId,
          status: 'cancelled'
        };
        $http({
            method: 'PUT',
            url: URL_PREFIX + '/api/booking/mybooking/' + $scope.bookingUpcoming.pk + '/',
            data: data1,
            headers: httpConfig
        }).
        then(function(response) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('You cancelled the request.')
            .hideDelay(3000)
            .position('top right')
          );
          $window.setTimeout(function(){location.reload();},3000);
        },function(error){
          if(error.status==403){
            $mdToast.show(
              $mdToast.simple()
              .textContent(error.data.error)
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
            // $window.location.reload();
          // return;
      });
        $scope.bookingCard = true;
    };

}]);

app.controller('accounts.completed', ['$scope', '$http', '$q', '$mdSidenav', '$stateParams','$mdDialog', function($scope, $http, $q, $mdSidenav, $stateParams,$mdDialog) {
  httpConfig['Content-Type'] = 'application/json';
    $http({
        method: 'GET',
        url: URL_PREFIX + '/api/booking/mybooking/?status=completed',
        headers: httpConfig
    }).then(function(response) {
        $scope.bookings = response.data;
    });
    $scope.showInfo=function(ev){
      $mdDialog.show(
       $mdDialog.alert()
         .parent(angular.element(document.querySelector('#popupContainer')))
         .clickOutsideToClose(true)
         .title('Car Details')
         .textContent('Description')
         .ariaLabel('Information Dialog')
         .ok('Thanks')
         .targetEvent(ev)
     );
   };
}]);

app.controller('accounts.contactUs', ['$scope', '$http', '$q', '$mdSidenav', '$stateParams',function($scope, $http, $q, $mdSidenav, $stateParams) {
  httpConfig['Content-Type'] = 'application/json';
}]);

app.controller('accounts.sendMail', ['$scope', '$http', '$q', '$mdSidenav', '$stateParams', '$cookies','$mdToast','$window','$state',function($scope, $http, $q, $mdSidenav, $stateParams, $cookies,$mdToast,$window,$state) {
  httpConfig['Content-Type'] = 'application/json';
  $http({
    method: 'GET',
    url: URL_PREFIX+'/api/support/ticket/?category',
    headers: httpConfig
  }).then(function(response) {
    $scope.cat = response.data;
  });

    $scope.submit = function() {
      if($scope.subject!==undefined && $scope.category!==undefined && $scope.desc!==undefined){
        var fd = {
          subject: $scope.subject,
          subcategory: $scope.category,
          description: $scope.desc
        };
        $http({
            url: URL_PREFIX + '/api/support/ticket/',
            method: 'POST',
            data: fd,
            headers: httpConfig
        }).then(function(response) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Thanks, Will get back to you shortly')
            .hideDelay(5000)
            .position('top right')
          );
          // $state.go('accounts');
          $scope.desc = '';
          $scope.subject = '';
          // $window.setTimeout(function(){location.reload();},3000);
        },function(error){
          $mdToast.show(
                $mdToast.simple()
                .textContent("Error, please try again later!")
                .hideDelay(5000)
                .position('top right')
            );
            // $window.setTimeout(function(){location.reload();},1000);
      });
    }
    };

}]);
app.controller('accounts', ['$scope', '$http', '$q', '$mdSidenav', '$stateParams', '$state',function($scope, $http, $q, $mdSidenav, $stateParams, $state) {
  httpConfig['Content-Type'] = 'application/json';
    $scope.isSidenavOpen = false;
    $scope.openLeftMenu = function() {
        if (!$scope.isSidenavOpen) {
            $scope.isSidenavOpen = true;
        } else {
            $scope.isSidenavOpen = false;
        }
    };
    $('#menuAccounts').tendina();

    $scope.thanksForm = false;
    $scope.toggleSubMenu = function(input) {
        if ($scope.subMenu == input) {
            $scope.subMenu = 'random';
            return;
        }
        $scope.subMenu = input;
    };


    $scope.openLeftMenu = function() {
        $scope.isSidenavOpen = true;
    };
}]);
