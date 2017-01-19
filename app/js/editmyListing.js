app.controller('editmyListing', ['$scope', 'Upload', '$http', '$state', '$mdBottomSheet', '$log', '$location', '$anchorScroll', '$mdToast', '$mdDialog', '$mdMedia', 'NgMap', 'MaterialCalendarData', '$cookies', '$sce', 'editList', 'calenderShare', '$helpgoryd', '$filter', 'indexShare', 'reviewCarImg', function($scope, Upload, $http, $state, $mdBottomSheet, $log, $location, $anchorScroll, $mdToast, $mdDialog, $mdMedia, NgMap, MaterialCalendarData, $cookies, $sce, editList, calenderShare, $helpgoryd, $filter, indexShare, reviewCarImg) {

  // upload later on form submit or something similar
  httpConfig['Content-Type'] = 'application/json';
  $scope.listing = editList.getProperty();
  if ($scope.listing==1) {
    $state.go('myListing.listings');
    return;
  }

  $scope.showListingForm = false;
  $scope.files = [];
  $scope.count = $helpgoryd.range(0,$scope.listing.media.length);
  $scope.formLevel = 'address';
  $scope.submit = function() {
    var fd = {
      isListingComplete: true
    };
    $http({
      method: 'PUT',
      url: URL_PREFIX + '/api/listing/vehicle/' + $scope.priceForm.vehicle + '/',
      data: fd,
      headers: {'Content-Type': 'application/json','Authorization': httpConfig.Authorization}
    }).
    then(function(response) {
      $scope.formLevel = 'thankyou';
    });
  };

  $scope.deleteddpID = null;
  $scope.deleteimage = function(image,index){
    if (image.name=='dp') {
      $scope.newdp=$scope.listing.media[index+1];
      $scope.deleteddpID=image.id;
      if ($scope.newdp!==undefined) {
        $http ({
          method: 'PUT',
          url: URL_PREFIX + '/api/listing/media/' + $scope.newdp.id+'/',
          data: {name: 'dp'},
          headers: httpConfig
        }).
        then(function(response) {
        });
      }
    }

    $http ({
      method: 'DELETE',
      url: URL_PREFIX+ '/api/listing/media/?pk='+image.id,
      headers: httpConfig
    }).
    then (function(response) {
      $mdDialog.cancel();
      $mdToast.show(
        $mdToast.simple()
        .textContent("Image deleted!")
        .hideDelay(3000)
        .position('bottom left')
      );
    },
    function(error) {
      $mdDialog.cancel();
      $mdToast.show(
        $mdToast.simple()
        .textContent("Error, please contact support@goryd.in for help!")
        .hideDelay(8000)
        .position('bottom left')
      );
    });
    $scope.listing.media.splice(index,1);
    $scope.count = $helpgoryd.range(0,$scope.listing.media.length);
  };

  $scope.postAddressCoordinates = function() {
    var fd = {
      lat: $scope.addressPicker.center[0],
      lon: $scope.addressPicker.center[1]
    };
    $http ({
      method: 'PUT',
      url: URL_PREFIX + '/api/listing/address/' + $scope.listing.address.pk + '/',
      data: fd,
      headers: httpConfig
    }).
    then(function() {
      $scope.formLevel = 'Upload Documents';
    });
  };

  var gmap = NgMap.getMap();
  $scope.$on('mapInitialized', function(event, map) {
	   map.setOptions({

     });
	});

  var userCurrentLocation = [$scope.listing.address.lat, $scope.listing.address.lon];
  if ($scope.listing.address.lat ===null){
    userCurrentLocation = [28.61, 77.21];
  }
  $scope.addressPicker = {
    initialCenter:  userCurrentLocation,
    center:  userCurrentLocation
  };
  $scope.initialCenterMap = function(){
    $scope.place = this.getPlace();
    userCurrentLocation  = [$scope.place.geometry.location.lat(),$scope.place.geometry.location.lng()];
    $scope.addressPicker = {
      initialCenter: userCurrentLocation,
      center: userCurrentLocation
    };
  };

  $scope.placeChanged = function() {
    $scope.place = this.getPlace();
    var center1  = [$scope.place.geometry.location.lat(),$scope.place.geometry.location.lng()];
    $scope.addressPicker = {
      center: center1,
      initialCenter: center1
    };
  };

  $scope.test_files = {
    files: []
  };

  $scope.bigScreen = function() {
    return $mdMedia('(min-width: 700px)');
  };

  if($scope.listing.address.street.split('\n')[1]===undefined){
    $scope.address2_edit = "";
  } else {
    $scope.address2_edit=$scope.listing.address.street.split('\n')[1];
  }

  $scope.form = {
    maker: $scope.listing.maker,
    model: $scope.listing.model,
    gear: $scope.listing.gearType,
    year: $scope.listing.year,
    kms: $scope.listing.kms,
    regNum: $scope.listing.regNum,
    address: $scope.listing.address.street.split('\n')[0],
    address2: $scope.listing.address.street,
    pincode: $scope.listing.address.pincode,
    state: $scope.listing.address.state,
    city: $scope.listing.address.city,
    files: $scope.listing.media,
  };

  $scope.priceForm = {
    availabilities: $scope.listing.availabilities,
    to: new Date(),
    from: new Date(),
    rangeMode: false,
    priceweekday: $scope.listing.weekdayPrice,
    priceweekend: $scope.listing.weekendPrice,
    deposit: $scope.listing.deposit,
    vehicle: $scope.listing.pk,
    today: new Date(),
  };

  $scope.delete = function(index) {
    $scope.priceForm.availabilities.splice(index, 1);
  };

  $scope.postAvailability = function(data1) {
    $http({
        method: 'POST',
        url: URL_PREFIX + '/api/listing/availability/',
        data: data1,
        headers: {'Content-Type': 'application/json','Authorization': httpConfig.Authorization}
    }).
    then(function(response) {
      $scope.getReview();
    }, function (error) {
        $http({
          method: 'POST',
          url: URL_PREFIX + '/api/listing/availability/',
          data: data1,
          headers: {'Content-Type': 'application/json','Authorization': httpConfig.Authorization}
        }).
        then(function(response) {
          $scope.getReview();
        }, function(error){
            $mdToast.show(
              $mdToast.simple()
              .textContent('Error, please try again later.')
              .hideDelay(3000)
              .position('top right')
            );
        });
    });
  };

  $scope.getReview = function(){
    $http({
      method: 'GET',
      url: URL_PREFIX + '/api/listing/vehicle/?pk=' + $scope.priceForm.vehicle,
      headers: httpConfig
    }).
    then(function(response) {
      $scope.reviewList  = response.data;
      $scope.formLevel = 'review your listing';
      $scope.dayFormat = 'd';
      $scope.firstDayOfWeek = 0;
      $scope.a = $helpgoryd.range(0,$scope.reviewList.media.length);
      $scope.setDirection = function(direction) {
        $scope.direction = direction;
        $scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
      };
      $scope.prevMonth = function(data) {
        $scope.msg = "You clicked (prev) month " + data.month + ", " + data.year;
      };
      $scope.nextMonth = function(data) {
        $scope.msg = "You clicked (next) month " + data.month + ", " + data.year;
      };
      $scope.dayClick = function(date) {
        $scope.msg = "You clicked " + $filter("date")(date, 'MMM d, y h:mm:ss a Z');
      };
      for (i = 0; i < $scope.reviewList.availabilities.length; i++) {
        $scope.snippet = $sce.trustAsHtml("<div style='width=100%'> <i class='fa fa-check' style='color:#0EB588' aria-hidden='true'></i></div>");
        MaterialCalendarData.setDayContent(new Date($scope.reviewList.availabilities[i]), $scope.snippet);
      }
    });
  };

  $scope.postPrice = function() {
    $scope.b = [];
    $scope.b[0] = $scope.priceForm.vehicle;
    var aval = [];
    var avalD =  calenderShare.getProperty();
    for (var i = 0; i < avalD.length; i++) {
      aval[i] = $filter("date")(avalD[i], 'yyyy-MM-dd');
    }
    dataToSend = {
      priceweekend: parseInt($scope.priceForm.priceweekend),
      priceweekday: parseInt($scope.priceForm.priceweekday),
      deposit: parseInt($scope.priceForm.deposit),
      dates: aval,
      vehicle: $scope.b,
    };
    $scope.postAvailability(dataToSend);
  };

  $scope.makerSearchText = '';
  $scope.carSearchText = '';
  $scope.modelSearchText = '';
  $scope.insuraceSearchText = '';
  $scope.gearSearchText = '';
  $scope.states = ['Delhi-NCR'];
  $scope.gearTypes = ['Automatic', 'Manual'];

  $scope.postAddress = function() {
    $scope.addressdata = {
      street: $scope.form.address2,
      city: $scope.form.city,
      state: $scope.form.state,
      pincode: $scope.form.pincode
    };
    $http({
      method: 'PUT',
      url: URL_PREFIX + '/api/listing/address/' + $scope.listing.address.pk + '/',
      data: $scope.addressdata,
      headers: httpConfig
    }).
    then(function(response) {
      $scope.formLevel = 'locate your car';
    }, function(error) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('Error, please try again later!')
          .hideDelay(3000)
          .position('top right')
        );
    });
  };

  $scope.goToTop = function() {
    $location.hash('top');
    $anchorScroll();
  };

  $scope.$watch('formLevel', function(oldValue, newValue) {
    $scope.goToTop();
  });


  $scope.submitFiles = function(files) {
    $scope.uploadFiles(files);
  };

  $scope.files1 = [];

  $scope.confirmPhotos = function(files) {
    $scope.files1 = $scope.files1.concat(files);
    $scope.files = [];
    $scope.existingdp=$scope.listing.media[0];
    for (var j=0; j<$scope.listing.media.length; j++) {
      if ($scope.listing.media[j].name=='dp') {
        $scope.existingdp=$scope.listing.media[j];
        $scope.newdp=$scope.existingdp;
      }
    }
    for (var k=0; k<$scope.listing.media.length; k++) {
      $scope.listing.media[k].name='normal';
    }
  };

  $scope.uploadFiles = function(files) {
    if ($scope.files1.length === 0) {
      $mdToast.show(
        $mdToast.simple()
        .textContent('No photos selected! Please select atleast 1.')
        .hideDelay(3000)
        .position('top right')
      );
      return 'Error. No photos selected! Please select atleast 1.';
    }
    if ($scope.files1.length > 6) {
      diff = $scope.files1.length - 6;
      while (diff !==0) {
        $scope.files1.shift();
        diff = diff-1;
      }
    }
    if ($scope.dp.length!= $scope.files1.length) {
      for (var i=$scope.dp.length;i<$scope.files1.length;i++) {
        $scope.dp[i] = 'normal';
      }
    }
    $scope.maxPhotos = 6;
    if ($scope.files1.length > $scope.maxPhotos) {
      $scope.error = true;
      $mdToast.show(
        $mdToast.simple()
        .textContent('Please do not upload more than 6 photos')
        .hideDelay(3000)
        .position('top right')
      );
      return "Error. Please do not upload more than 6 photos";
    }
    if ($scope.dp.length===0 && $scope.files1.length !==0) {
      $scope.error = true;
      $mdToast.show(
        $mdToast.simple()
        .textContent('Please select one photo to make it main photo')
        .hideDelay(3000)
        .position('top right')
      );
      return "Error. Choose files than 6 files";
    }
    if ($scope.files1 && $scope.files1.length) {
      $scope.error = false;
      var DPinfiles=false;
      for(var j=0;j<$scope.dp.length;j++) {
        if($scope.dp[j]=='dp') {
          DPinfiles=true;
          break;
        }
      }
      if(($scope.existingdp!==$scope.newdp && $scope.existingdp.id!=$scope.deleteddpID && $scope.existingdp!==undefined) || (DPinfiles===true && $scope.existingdp!==undefined)) {
        $http({
          method: 'PUT',
          url: URL_PREFIX + '/api/listing/media/' + $scope.existingdp.id+'/',
          data: {name: 'normal'},
          headers: httpConfig
        }).
        then(function(response) {
        });
      }
      if($scope.existingdp!==$scope.newdp && DPinfiles===false && $scope.newdp!==undefined) {
        $http({
          method: 'PUT',
          url: URL_PREFIX + '/api/listing/media/' + $scope.newdp.id+'/',
          data: {name: 'dp'},
          headers: httpConfig
        }).
        then(function(response) {
        });
      }

      Upload.upload({
        url: URL_PREFIX + '/api/listing/media/',
        data: {
          attachment: $scope.files1,
          vehicle: $scope.listing.pk,
          name: $scope.dp
        },
        headers: httpConfig
      }).
      then(function(response) {
        $scope.listing.media.push(response.data);
        $scope.form.files.push(response.data);
          $scope.formLevel = 'rent and availability';
          $mdToast.show(
            $mdToast.simple()
            .textContent('Uploaded!')
            .hideDelay(3000)
            .position('top right')
          );
      }, function(error) {
          $mdToast.show(
          $mdToast.simple()
          .textContent('Error!')
          .hideDelay(3000)
          .position('top right')
        );
      });
    }
  };

  $scope.dp = ['dp'];
  $scope.mainPhoto = function(files1, index) {
    $scope.dp[0] = 'dp';
    for (var i = 0; i < files1.length; i++) {
      $scope.dp[i] = 'normal';
    }
    for(var j=0;j<$scope.listing.media.length;j++) {
      $scope.listing.media[j].name='normal';
    }
    $scope.dp[index] = 'dp';
  };

  $scope.setDP = function(files1,index) {
    for(var j=0;j<$scope.listing.media.length;j++) {
      $scope.listing.media[j].name='normal';
    }
    for (var i = 0; i < files1.length; i++) {
      $scope.dp[i] = 'normal';
    }
    $scope.listing.media[index].name='dp';
    $scope.newdp=$scope.listing.media[index];
  };
  $scope.eventSources = [];
  $scope.$watch('formLevel', function(newValue, oldValue) {
    $scope.goToTop();
    if (oldValue == 'address') {
      NgMap.getMap().then(function(map) {
        $scope.map = map;
        $scope.centerChanged = function(event) {
          $scope.addressPicker.center = [$scope.map.center.lat(), $scope.map.center.lng()];
        };
      });
      gmap.then(function(map) {
        $scope.centerChanged = function(event) {
          $scope.addressPicker.center = [map.center.lat(), map.center.lng()];
        };
      });
    } else if (oldValue == 'locate your car') {
        $scope.postAddressCoordinates();
    } else if (oldValue == 'Upload Documents') {
        // if($scope.files1.length===0) {
        //   $scope.submitFiles($scope.test_files.files);
        // }
    } else if (oldValue == 'rent and availability') {
        $scope.postPrice();
    }
    if (newValue=='review your listing') {
      $scope.getReview();
    }
    if (newValue=='rent and availability') {
      for (i = 0; i < $scope.listing.availabilities.length; i++) {
        $scope.snippet = $sce.trustAsHtml("<div style='width=100%'> <i class='fa fa-check' style='color:#0EB588' aria-hidden='true'></i></div>");
        MaterialCalendarData.setDayContent(new Date($scope.listing.availabilities[i]), $scope.snippet);
      }
    }
  });

  $scope.indexPhoto = indexShare.getProperty();
  $scope.a = reviewCarImg.getProperty();

  $scope.nextPhoto = function() {
    if($scope.indexPhoto < $scope.a.media.length - 1) {
      $scope.indexPhoto++;
    } else{
      $scope.indexPhoto = 0;
    }
  };

  $scope.prevPhoto = function() {
    if($scope.indexPhoto > 0) {
      $scope.indexPhoto--;
    } else {
        $scope.indexPhoto = $scope.a.media.length - 1;
    }
  };

  $scope.imageDialogues = function(i) {
    indexShare.setProperty(i);
    reviewCarImg.setProperty($scope.reviewList);
    $mdDialog.show({
      templateUrl: 'templates/imagePopUp.html',
      parent: angular.element(document.body),
      controller: 'editmyListing',
      clickOutsideToClose: true
    }).
    then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };

  $scope.dataURItoBlob=function(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  };

  var counter=1;
  $scope.myFile=null;
  $scope.createFiles = function(i) {
    var myBlob=$scope.dataURItoBlob(i);
    $scope.myFile=new File([myBlob],"newimage"+counter);
    counter++;
    return $scope.myFile;
  };

}]);
