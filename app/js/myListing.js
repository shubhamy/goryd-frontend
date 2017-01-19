app.config(function($stateProvider) {
    $stateProvider
        .state('myListing.requested', {
            url: "/requested",
            templateUrl: 'templates/myListing.requested.html',
            controller: 'myListing.requested'
        });
    $stateProvider
        .state('myListing.ongoing', {
            url: "/ongoing",
            templateUrl: 'templates/myListing.ongoing.html',
            controller: 'myListing.ongoing'
        });
    $stateProvider
        .state('myListing.completed', {
            url: "/completed",
            templateUrl: 'templates/myListing.completed.html',
            controller: 'myListing.completed'
        });
    $stateProvider
        .state('myListing.earnings', {
            url: "/earnings",
            templateUrl: 'templates/myListing.earnings.html',
            controller: 'myListing.earnings'
        });
    $stateProvider
        .state('myListing.listings', {
            url: "/listings",
            templateUrl: 'templates/myListing.listings.html',
            controller: 'myListing.listings'
        });
    $stateProvider
        .state('myListing.customerProfile', {
            url: "/customerProfile",
            templateUrl: 'templates/myListing.customerProfile.html',
            controller: 'myListing.customerProfile'
        });
});

app.controller('myListing.listings', ['$scope', '$http', '$q', '$mdSidenav', '$stateParams', '$state','editList','$mdToast','indexShare','$mdDialog','$window',function($scope, $http, $q, $mdSidenav, $stateParams,$state,editList,$mdToast,indexShare,$mdDialog,$window) {
  httpConfig['Content-Type'] = 'application/json';
    $http({
        method: 'GET',
        url: URL_PREFIX + '/api/listing/vehicle/',
        headers: httpConfig
    }).then(function(response) {
        $scope.listings = response.data;
    });
    $http({
        method: 'GET',
        url: URL_PREFIX + '/api/users/profile/?mode=self',
        headers: httpConfig
    }).then(function(response){
      $scope.isVerified = $scope.profile.isVerifiedRenter;
    });

    $scope.edit = function($index){
      $http({
        method: 'GET',
        url: URL_PREFIX+ '/api/listing/vehicle/?pk=' +$scope.listings[$index].id,
        headers: httpConfig
      }).then(function(response){
        $scope.elisting = response.data;
        editList.setProperty($scope.elisting);
        $state.go('editmyListing');
      },function(error){
        $mdToast.show(
              $mdToast.simple()
              .textContent("Error, please try again later!")
              .hideDelay(3000)
              .position('top right')
          );
      });
    };
    $scope.setActive = function(i){
      $scope.inActiveRequest = angular.copy($scope.listings[i]);
      var data1 = {
        'active': 1
      };
      $http({
          method: 'PUT',
          url: URL_PREFIX + '/api/listing/vehicle/' + $scope.inActiveRequest.id + '/',
          data: data1,
          headers: httpConfig
      }).
      then(function(response) {
        $mdToast.show(
              $mdToast.simple()
              .textContent("You set the car as Active")
              .hideDelay(3000)
              .position('top right')
          );
          $scope.listings[i].active=true;
          // $window.setTimeout(function(){location.reload();},3000);
      },function(error){
          $mdToast.show(
            $mdToast.simple()
            .textContent("Error, please try again later!")
            .hideDelay(3000)
            .position('top right')
          );
      });
    };
    $scope.initiateInactive = function(i){
      $mdDialog.show({
        // controller: DialogController,
        templateUrl: 'templates/myListing.initiateInactive.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true
      }).then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
      indexShare.setProperty(i);
      // $scope.listings[i].active = false;

    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.setInactive = function(reason){
      var i = indexShare.getProperty();
      $scope.inActiveRequest = angular.copy($scope.listings[i]);
      var data1 = {
        'active': 0
      };
      $http({
          method: 'PUT',
          url: URL_PREFIX + '/api/listing/vehicle/' + $scope.inActiveRequest.id + '/',
          data: data1,
          headers: httpConfig
      }).
      then(function(response) {
        $mdToast.show(
              $mdToast.simple()
              .textContent("You set the car as inactive")
              .hideDelay(3000)
              .position('top right')
          );
          // $scope.a();
          // $window.setTimeout(function(){$scope.listings[i].active=false;},3000);
          $window.setTimeout(function(){$mdDialog.cancel();location.reload();},3000);
      },function(error){
          $mdToast.show(
            $mdToast.simple()
            .textContent("Error, please try again later!")
            .hideDelay(3000)
            .position('top right')
          );
      });
    };

}]);

app.controller('myListing.requested', ['$scope', '$cookies', '$http', '$q', '$mdSidenav', '$stateParams','$mdToast','$window','$mdDialog','indexShare','$state','customerProf',function($scope, $cookies, $http, $q, $mdSidenav, $stateParams,$mdToast,$window,$mdDialog,indexShare,$state,customerProf) {
  httpConfig['Content-Type'] = 'application/json';
    // $scope.rejectBooking = false;
    // var index1 = -1;
    $http({
        method: 'GET',
        url: URL_PREFIX + '/api/listing/vehicle/?status=requested',
        headers: httpConfig
    }).then(function(response) {
        $scope.bookings = response.data;
    });
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.bookingApprove = function(i) {
      $scope.bookingRequest = {};
        // $scope.bookings[i].approved = true;
        // $scope.bookingText = "Approve";
        $scope.bookingRequest = angular.copy($scope.bookings[i]);
        var data1 = {
          bookingId : $scope.bookingRequest.bookingId,
          status: 'approved'
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
                .textContent("Success! You approved the booking")
                .hideDelay(3000)
                .position('top right')
            );
            $window.setTimeout(function(){location.reload();},3000);
        },function(error){
          if(error.status==403){
            $mdToast.show(
                  $mdToast.simple()
                  .textContent("Something's fishy!")
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
        });
        $scope.bookingCard = true;
    };
    $scope.initiateReject = function(i){
      $mdDialog.show({
        // controller: DialogController,
        templateUrl: 'templates/myListing.initiateReject.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true
      }).then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
      indexShare.setProperty(i);
    };
    $scope.bookingReject = function(reason) {
        $mdDialog.cancel();
        var i = indexShare.getProperty();
        $scope.bookingRequest = {};
        $scope.bookingRequest = angular.copy($scope.bookings[i]);
        var data1 = {
          bookingId : $scope.bookingRequest.bookingId,
          status: 'rejected',
          comment: reason
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
                .textContent("Oh no! You rejected the booking")
                .hideDelay(3000)
                .position('top right')
            );
            $window.setTimeout(function(){location.reload();},3000);
        },function(error){
          if(error.status==403){
            $mdToast.show(
                  $mdToast.simple()
                  .textContent("Something's fishy!")
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
        });
        $scope.bookingCard = true;
    };
    $scope.viewProfile = function(i) {
      $scope.customer = {};
        // $scope.bookings[i].approved = true;
        // $scope.bookingText = "Approve";
        $scope.bookingRequest = angular.copy($scope.bookings[i]);
        $scope.customerEmail  = $scope.bookingRequest.customer.email;
        // var data1 = {
        //   bookingId : $scope.bookingRequest.bookingId,
        //   status: 'approved'
        // };
        $http({
            method: 'GET',
            url: URL_PREFIX + '/api/users/profile/?mode=myrenter&customer=' + $scope.customerEmail,
            // data: data1,
            headers: httpConfig
        }).
        then(function(response) {
          customerProf.setProperty(response.data);
          $state.go('myListing.customerProfile');
          // $mdToast.show(
          //       $mdToast.simple()
          //       .textContent("Success! You approved the booking")
          //       .hideDelay(3000)
          //       .position('top right')
          //   );
            // $window.setTimeout(function(){location.reload();},3000);
        },function(error){
          if(error.status==403){
            $mdToast.show(
                  $mdToast.simple()
                  .textContent("Something's fishy!")
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
        });
        $scope.bookingCard = true;
    };
}]);

app.controller('myListing.ongoing', ['$scope', '$http', '$q', '$mdSidenav', '$stateParams','$mdToast','$window','$state','customerProf',function($scope, $http, $q, $mdSidenav, $stateParams,$mdToast,$window,$state,customerProf) {
  httpConfig['Content-Type'] = 'application/json';
    $http({
        method: 'GET',
        url: URL_PREFIX + '/api/listing/vehicle/?status=approved',
        headers: httpConfig
    }).then(function(response) {
        $scope.bookings = response.data;
    });
    $scope.bookingComplete = function(i) {
        $scope.bookingComp = {};
        $scope.bookings[i].status = 'completed';
        $scope.bookingComp = angular.copy($scope.bookings[i]);
        $scope.form = {
          bookingId : $scope.bookingComp.bookingId,
          status: 'completed'
          // review: comment,
          // rating: rate
        };
        $http({
            method: 'PUT',
            url: URL_PREFIX + '/api/booking/mybooking/' + $scope.bookingComp.pk + '/',
            data: $scope.form,
            headers: httpConfig
        }).
        then(function(response) {
          $mdToast.show(
                $mdToast.simple()
                .textContent('Woopie!! Ride complete request sent')
                .hideDelay(3000)
            );
            $window.setTimeout(function(){location.reload();},3000);
          },function(error) {
            $mdToast.show(
                  $mdToast.simple()
                  .textContent('Error, please try again later')
                  .hideDelay(3000)
              );
          });
    };
    $scope.viewProfile = function(i) {
      $scope.customer = {};
        // $scope.bookings[i].approved = true;
        // $scope.bookingText = "Approve";
        $scope.bookingRequest = angular.copy($scope.bookings[i]);
        $scope.customerEmail  = $scope.bookingRequest.customer.email;
        // var data1 = {
        //   bookingId : $scope.bookingRequest.bookingId,
        //   status: 'approved'
        // };
        $http({
            method: 'GET',
            url: URL_PREFIX + '/api/users/profile/?mode=myrenter&customer=' + $scope.customerEmail,
            // data: data1,
            headers: httpConfig
        }).
        then(function(response) {
          customerProf.setProperty(response.data);
          $state.go('myListing.customerProfile');
          // $mdToast.show(
          //       $mdToast.simple()
          //       .textContent("Success! You approved the booking")
          //       .hideDelay(3000)
          //       .position('top right')
          //   );
            // $window.setTimeout(function(){location.reload();},3000);
        },function(error){
          if(error.status==403){
            $mdToast.show(
                  $mdToast.simple()
                  .textContent("Something's fishy!")
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
        });
        $scope.bookingCard = true;
    };

}]);

app.controller('myListing.completed', ['$scope', '$http', '$q', '$mdSidenav', '$stateParams','$mdDialog',function($scope, $http, $q, $mdSidenav, $stateParams,$mdDialog) {
  httpConfig['Content-Type'] = 'application/json';
    $http({
        method: 'GET',
        url: URL_PREFIX + '/api/listing/vehicle/?status=completed',
        headers: httpConfig
    }).then(function(response) {
        $scope.bookings = response.data;
    });
  //   $scope.showInfo=function(ev){
  //     $mdDialog.show(
  //      $mdDialog.confirm()
  //        .clickOutsideToClose(true)
  //        .title('Car Details')
  //        .textContent('Description')
  //        .ariaLabel('Information Dialog')
  //        .ok('Thanks')
  //        .targetEvent(ev)
  //    );
  //  };
}]);

app.controller('myListing.earnings', ['$scope', '$http', '$q', '$mdSidenav', '$stateParams',function($scope, $http, $q, $mdSidenav, $stateParams) {
  httpConfig['Content-Type'] = 'application/json';

}]);

app.controller('myListing', ['$scope', '$http', '$q', '$mdSidenav', '$stateParams', '$state',function($scope, $http, $q, $mdSidenav, $stateParams, $state) {
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
app.controller('myListing.customerProfile', ['$scope', '$http','customerProf', function($scope, $http,customerProf) {
  httpConfig['Content-Type'] = 'application/json';
    $scope.customerProfile = customerProf.getProperty();
    $scope.isReviews = true;
    // $scope.profile = response.data;
    $scope.username = $scope.customerProfile.user.first_name + ' ' + $scope.customerProfile.user.last_name;
    $scope.myRate = $scope.customerProfile.rating;
    if($scope.customerProfile.myReviews.length===0){
      $scope.isReviews=false;
    }
    $scope.customerProfileImage = $scope.customerProfile.dp;
    if($scope.customerProfile.dl===undefined||$scope.customerProfile.dl===null){
      $scope.showDL  = false;
    }else{
      $scope.showDL=true;
      $scope.customerdl = $scope.customerProfile.dl;

    }
    if($scope.customerProfile.idProof===undefined||$scope.customerProfile.idProof===null){
      $scope.showID  = false;
    }else{
      $scope.showID=true;
      $scope.customeridProof = $scope.customerProfile.idProof;

    }
    var index = 0;
    var value = 0;
    $scope.reviewerrating = function() {
        value = $scope.customerProfile.myReviews[index].rating;
        index++;
        return value;
    };
}]);
