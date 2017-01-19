app.controller('RightCtrl', ['$scope', '$mdDialog', '$http', '$state', '$mdSidenav', '$log', '$mdBottomSheet', '$mdMedia', '$rootScope', '$filter','$mdToast', '$window', function($scope, $mdDialog, $http, $state, $mdSidenav, $log, $mdBottomSheet, $mdMedia, $rootScope, $filter,$mdToast, $window) {
  httpConfig['Content-Type'] = 'application/json';
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

  $scope.$on('showEditorPanel', function(evt, params) {
    $scope.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'templates/bottomSheet.html',
      controller: 'home'
    })
    .then(function(clickedItem) {
      $scope.alert = clickedItem.name + ' clicked!';
    });
  });

  var originatorEv;
  $scope.openMenu = function($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };

  $scope.announceClick = function(index) {
    $mdDialog.show(
      $mdDialog.alert()
      .title('You clicked!')
      .textContent('You clicked the menu item at index ' + index)
      .ok('Nice')
      .targetEvent(originatorEv)
    );
    originatorEv = null;
  };

  $scope.close = function() {
    $mdSidenav('right').close()
      .then(function() {
        $log.debug("close RIGHT is done");
      });
  };

  $scope.updateListings = function() {
    var imagePath = 'images/userIcon.png';
    var lat = '';
    var lng = '';
    if (typeof SEARCH_LOCATION_COORDINATES == 'undefined' || SEARCH_LOCATION_COORDINATES === null) {
      lat = '28.5689165579';
      lng = '77.1542346563';
    } else {
      lat = SEARCH_LOCATION_COORDINATES.lat();
      lng = SEARCH_LOCATION_COORDINATES.lng();
    }
    $http({
      method: 'GET',
      url: URL_PREFIX + '/api/listing/listingView/?lat=' + lat + '&lon=' + lng + '&start=' + $filter('date')(START_DATETIME, "dd-MM-yyyyTHH:mm",'+0530') + '&end=' +$filter('date')(END_DATETIME, "dd-MM-yyyyTHH:mm",'+0530'),
    }).
    then(function(response) {
      $scope.listings = response.data;
      if ($scope.listings.length===0) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('No availabilities, please change search parameters')
          .hideDelay(3000)
          .position('top right')
        );
        setTimeout(function() {
          $state.go('home');
        }, 1000);
      }
      $rootScope.$broadcast('updateMarkers', $scope.listings);
    }, function(error) {
        if (error.status == 404) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('No results found for the selected dates.')
            .hideDelay(3000)
            .position('top right')
          );
          setTimeout(function() {
            $state.go('home');
          }, 1000);
        }
    });
  };

  $scope.$on('updateSearchParams', function(evt, params) {
    $scope.updateListings();
  });

  $scope.updateListings();

  $scope.showTabDialog = function($event,$index) {
    $scope.listingInView = $scope.listings[$index];
    $mdDialog.show({
      clickOutsideToClose: true,
      templateUrl: 'templates/modal.explore.listing.html',
      controller: 'home.list.modal',
      parent: angular.element(document.body),
      targetEvent: $event,
      locals: {
        listing: $scope.listingInView
      },
    });
  };

  $scope.sendBookingRequest = function($index) {
    var pk = $scope.listings[$index].pk;
    $scope.loadingIcon=true;
    $http({
      method: 'POST',
      url: URL_PREFIX + '/api/booking/mybooking/',
      data: {
        vehicle: pk,
        to: $filter('date')(END_DATETIME, "yyyy-MM-ddTHH:mm",'+0530'),
        from: $filter('date')(START_DATETIME, "yyyy-MM-ddTHH:mm",'+0530'),
        status: 'requested'
      },
      headers: httpConfig
    })
    .then(function(response) {
      $mdToast.show({
        template: '<md-toast><a href="#/accounts/requested" style="color: #08c64a">Thanks, your request is succesfully sent. Check My Accounts.</a></md-toast>',
        hideDelay : 3000,
        position: 'top right'
      });
      $window.setTimeout(function() {$state.go('accounts.requested');}, 3000);
        // $scope.pagelevel = 'thankyou';
        // $scope.bookingid = response.data.bookingId;
        $scope.loadingIcon=false;
    }, function(error) {
        if (error.status == 401) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('You need to be logged in for that! Please login!')
            .hideDelay(5000)
            .position('top right')
            .position('top right')
            .position('top right')
          );
          $scope.loadingIcon=false;
          $scope.toggleLoginForm();
          return;
        } else if (error.status==400) {
            $scope.loadingIcon=false;
            $mdToast.show(
              $mdToast.simple()
              .textContent(error.data.error)
              .hideDelay(3000)
              .position('top right')
              .position('top right')
            );
        } else {
            $scope.loadingIcon=false;
            $mdToast.show(
              $mdToast.simple()
              .textContent('Error, please try again later!')
              .hideDelay(3000)
              .position('top right')
            );
        }
    });
  };

}]);
