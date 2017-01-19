app.controller('home.list', ['$scope', '$http', '$state', '$timeout', '$interval', '$mdSidenav', '$mdComponentRegistry', '$log', '$mdDialog', '$mdMedia', 'NgMap', '$helpgoryd', '$mdToast', '$rootScope','indexShare','date1','date2','$filter','$window', function($scope, $http, $state, $timeout, $interval, $mdSidenav, $mdComponentRegistry, $log, $mdDialog, $mdMedia, NgMap, $helpgoryd, $mdToast, $rootScope,indexShare,date1,date2,$filter,$window) {
  httpConfig['Content-Type'] = 'application/json';
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    $mdDialog.cancel();
  });
  $scope.swiped = false;
  $scope.logged = LOGGED;
  $scope.loadingIcon =false;
  $scope.updateSearchParams = function() {
    $scope.loadingIcon =true;
    $scope.t1 = START_TIME === null ? '6:00 AM' : START_TIME;
    $scope.t2 = END_TIME === null ? '10:00 PM' : END_TIME;
    $scope.d1 = START_DATETIME === null ? new Date(Date.now()) : START_DATETIME;
    $scope.d2 = END_DATETIME === null ? new Date(Date.now() + 24 * 3600 * 1000) : END_DATETIME;
    date1.setProperty(stringToDate($scope.d1,$scope.t1));
    date2.setProperty(stringToDate($scope.d2,$scope.t2));
  };
  stringToDate = function(date, time_string) {
    dateTime = date;
    time = time_string.split(":");
    time[1] = time[1].split(" ");
    if (time[1][1] == "PM") {
      time[0] = parseInt(time[0]) + 12;
    }
    dateTime.setHours(time[0]);
    dateTime.setMinutes(time[1][0]);
    return dateTime;
  };
  $scope.updateSearchParams();

  $scope.$on('updateSearchParams', function(evt, params) {
    $scope.updateSearchParams();
  });

  $scope.showEditorPanel = function() {
    $rootScope.$broadcast('showEditorPanel', {});
  };

  $scope.like = function() {
    $mdToast.show(
      $mdToast.simple()
      .textContent('Thanks!')
      .hideDelay(3000)
      .position('top right')
    );
  };

  $scope.toggleLoginForm = function(input) {
    $mdDialog.cancel();
    $scope.$emit('toggleLoginForm', input);
  };

  $scope.$on('updateProfile', function(evt, params) {
    $scope.profile = params;
  });

  $scope.mapPos = [28.61, 77.21]; //Delhi
  $scope.zoomInitial = 13;
  $scope.listings = [];
  $scope.transition = true;
  $scope.mapMarkers = [];
  $scope.markerPos = $scope.mapPos;
  $scope.$on('bringMarkerinFocus', function(event, listing) {
    $scope.bringMarkerInFocus(listing);
  });

  $scope.bringMarkerInFocus = function(listing) {
    if (typeof listing == 'undefined') {
      listing = $scope.listings[0];
    }
    var adrs = listing.address;
    var markerPos = [parseFloat(adrs.lat), parseFloat(adrs.lon)];
    $scope.markerPos = markerPos;
    $scope.listingInView = listing;
    var input =  '';
    if (typeof $scope.listingInView.media[0] == 'undefined' || $scope.listingInView.media[0] === null) {
      input = '/images/car.svg';
    } else{
      input = URL_PREFIX + $scope.listingInView.media[0].attachment;
    }
  };

  $scope.mapMarkerFocus = function(i) {
    item = $scope.listings[i];
    $scope.$emit('bringMarkerinFocus', item);
  };

  $scope.$on('updateMarkers', function(event, listings) {
    $scope.listings = [];
    if(listings.length===0){
      $scope.loadingIcon =true;
    } else {
      $scope.loadingIcon =false;
    }
    $scope.mapPos = [listings[0].address.lat, listings[0].address.lon];
    $scope.listingInView = listings[0];
    for (var i = 0; i < listings.length; i++) {
      if (listings[i].address.lat !== null && listings[i].address.lon !== null) {
        $scope.listings.push(listings[i]);
        $scope.mapMarkers.push([parseFloat(listings[i].address.lat), parseFloat(listings[i].address.lon)]);
      }
    }
    var input =  '';
    $scope.mediaCar = [];
    for (i=0;i<listings.length;i++){
      if (typeof $scope.listings[i].media[0] == 'undefined' || $scope.listings[i].media[0] === null) {
        input = '/images/car.svg';
      } else {
        input = URL_PREFIX + $scope.listings[i].media[0].attachment;
      }
      $scope.mediaCar[i] = input;
    }
  });

  var numDeltas = 5.0;
  $scope.delay = 0.1; //milliseconds
  var deltaLat;
  var deltaLng;

  $scope.$on('mapInitialized', function(event, map) {
    map.setOptions({
    });
  });

  NgMap.getMap().then(function(map) {
    $scope.showCustomMarker = function(evt) {
      var markerId = parseInt(this.id.split('marker_')[1]);
      $scope.listingInView = $scope.listings[markerId];
      $scope.mapMarkers1 =   $scope.mapMarkers.splice(markerId, 1);
      $scope.markerInFocus = $scope.mapMarkers[markerId];
      $scope.result = $scope.markerInFocus;
      $scope.transition = true;
      $scope.mapPos = $scope.result;
      $scope.markerPos = $scope.mapPos;
      function changeMapCenter(e10) {
        deltaLat = parseFloat(((e10*parseFloat($scope.result[0]) - e10*parseFloat($scope.position[0])) / numDeltas).toPrecision(8));
        deltaLng = parseFloat(((e10*parseFloat($scope.result[1]) - e10*parseFloat($scope.position[1])) / numDeltas).toPrecision(8));
        $scope.transition = true;
        $scope.mapPos = $scope.result;
      }
      function moveMarker(e10) {
        $scope.position[0] = parseFloat(e10*parseFloat(parseFloat($scope.position[0]).toPrecision(8)) + deltaLat)/e10;
        $scope.position[1] = parseFloat(e10*$scope.position[1] + deltaLng)/e10;
        $scope.mapPos = $scope.position;
        $scope.markerPos = $scope.mapPos;
      }
      var e10  = 10000000000;
      $scope.smootherCount = 0;
    };
    $scope.closeCustomMarker = function(evt) {
      this.style.display = 'none';
    };
  });
  $scope.expClass = [];
  $scope.expMarker = function(mapMarkers,$index) {
    $scope.expClass[0] = 'expandMapMarker';
    for (var i = 0; i < mapMarkers.length; i++) {
      $scope.expClass[i] = '';
    }
    $scope.expClass[$index] = 'expandMapMarker';
  };
  $scope.collapseMarker=function(mapMarkers){
    $scope.expClass=[];
  };
  $scope.highlightListingMarker = function(listings,$index) {
    for (var i = 0; i < listings.length; i++) {
      $scope.expClass[i] = '';
    }
    $scope.expClass[$index] = 'expandMapMarker';
  };
  $scope.showTabDialog = function(ev, index) {
    $scope.listingInView = $scope.listings[index];
    $mdDialog.show({
      controller: 'home.list.modal',
      templateUrl: 'templates/modal.explore.listing.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      resolve: {
        listing: function() {
          return $scope.listingInView;
        }
      },
      clickOutsideToClose: true
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
          $scope.status = 'You cancelled the dialog.';
    });
  };

  $scope.$watch('listingInViewIndex', function(newValue, oldValue) {
    if ($scope.listings.length === 0) {
      return;
    }
    $scope.listingInView = $scope.listings[newValue];
    $scope.bringMarkerInFocus($scope.listingInView);
    var adrs = $scope.listingInView.address;
    var markerPos = [parseFloat(adrs.lat), parseFloat(adrs.lon)];
    $scope.mapPos = markerPos;
  });

  $scope.onSwipeRight = function(ev) {
    $scope.swiped = false;
    $scope.listingInViewIndex -= 1;
    if ($scope.listingInViewIndex < 0) {
      $scope.listingInViewIndex += 1;
    }
  };

  $scope.onSwipeLeft = function(ev) {
    // alert('You swiped left!!');
    $scope.swiped = true;
    $scope.listingInViewIndex += 1;
    if ($scope.listingInViewIndex > $scope.listings.length - 1) {
      $scope.listingInViewIndex -= 1;
    }
  };

  $scope.getCardPos = function(index) {
    if ($scope.listingInViewIndex == index) {
      return '0';
    } else {
        if (index < $scope.listingInViewIndex) {
          return '-1000';
        } else {
          return '1000';
        }
    }
  };

  $scope.listingInViewIndex = 0;
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

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

  $scope.demo = {
    isOpen: false,
    count: 0,
    selectedDirection: 'right'
  };

  $scope.toggle = angular.noop;
  $scope.isOpen = function() {
    return false;
  };

  $mdComponentRegistry
    .when('right')
    .then(function(sideNav) {
      $scope.isOpen = angular.bind(sideNav, sideNav.isOpen);
      $scope.toggle = angular.bind(sideNav, sideNav.toggle);
    });

  $scope.toggleRight = function() {
    $mdSidenav('right')
      .toggle()
      .then(function() {
        $log.debug("toggle RIGHT is done");
      });
  };

  $scope.sendBookingRequest = function($index) {
    var pk = $scope.listings[$index].pk;
    // console.log(1);
    $scope.loadingIconBooking=true;
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
        $scope.loadingIconBooking=false;
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
          $scope.loadingIconBooking=false;
          $scope.toggleLoginForm();
          return;
        } else if (error.status==400) {
            $scope.loadingIconBooking=false;
            $mdToast.show(
              $mdToast.simple()
              .textContent(error.data.error)
              .hideDelay(3000)
              .position('top right')
              .position('top right')
            );
        } else {
            $scope.loadingIconBooking=false;
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
