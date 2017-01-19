app.controller('home.list.modal', ['$scope', '$mdDialog', 'listing', '$http', '$mdToast', '$filter', '$helpgoryd', '$state', 'date1', 'date2', function DialogController($scope, $mdDialog, listing, $http, $mdToast, $filter, $helpgoryd, $state, date1, date2) {
  httpConfig['Content-Type'] = 'application/json';
  var time1 = date1.getProperty();
  var time2 = date2.getProperty();
  var time3 = time2 - time1;

  $scope.listing = listing;
  $scope.diffTime = parseInt(time3/3600000);
  $scope.a = $helpgoryd.range(0,$scope.listing.media.length);

  $scope.toggleLoginForm = function(input) {
    $scope.$emit('toggleLoginForm', input);
  };

  $scope.pagelevel = 'notsent';

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };

  $scope.bookingid = '';

  $scope.viewBooking = function() {
    $state.go('accounts.requested');
  };

  $scope.zoomimgTab=false;

  $scope.zoomImg = function($index) {
    $scope.zoomimgTab=!$scope.zoomimgTab;
    $scope.i=$index;
  };

  $scope.nextZoomImg = function() {
    if ($scope.i < $scope.listing.media.length - 1) {
      $scope.i++;
    } else {
      $scope.i = 0;
    }
  };

  $scope.prevZoomImg = function() {
    if ($scope.i > 0) {
      $scope.i--;
    } else {
      $scope.i = $scope.listing.media.length - 1;
    }
  };

  $scope.sendBookingRequest = function() {
    $scope.loadingIcon=true;
    $http({
      method: 'POST',
      url: URL_PREFIX + '/api/booking/mybooking/',
      data: {
        vehicle: $scope.listing.pk,
        to: $filter('date')(END_DATETIME, "yyyy-MM-ddTHH:mm",'+0530'),
        from: $filter('date')(START_DATETIME, "yyyy-MM-ddTHH:mm",'+0530'),
        status: 'requested'
      },
      headers: httpConfig
      }).then(function(response) {
          $scope.pagelevel = 'thankyou';
          $scope.bookingid = response.data.bookingId;
          $scope.loadingIcon=false;
        }, function(error){
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
            }
            else if (error.status==400) {
              $scope.loadingIcon=false;
              $mdToast.show(
                $mdToast.simple()
                .textContent(error.data.error)
                .hideDelay(3000)
                .position('top right')
                .position('top right')
              );
            }
            else {
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
