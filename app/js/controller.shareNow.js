app.controller('home.shareNow', ['$scope', 'Upload', '$http', '$state', '$mdBottomSheet', '$log', '$location', '$anchorScroll', '$mdToast', '$mdMedia', 'NgMap', 'MaterialCalendarData', '$cookies', '$sce', '$filter', 'calenderShare','$helpgoryd','$mdDialog','indexShare','reviewCarImg', function($scope, Upload, $http, $state, $mdBottomSheet, $log, $location, $anchorScroll, $mdToast, $mdMedia, NgMap, MaterialCalendarData, $cookies, $sce, $filter, calenderShare,$helpgoryd,$mdDialog,indexShare,reviewCarImg) {
  httpConfig['Content-Type'] = 'application/json';
  $scope.showListingForm = false;
  $scope.files = [];
  $scope.formLevel = 'basic information';
  $scope.submit = function() {
    $scope.loadingIconShareNow=true;
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
      $scope.loadingIconShareNow=false;
      $scope.formLevel = 'thankyou';
      clearAllData();
    });
  };
  clearAllData=function(){
    $scope.form ={
      maker: '',
      model: '',
      regNum: '',
      gear: 'Manual',
      year: '',
      kms: '',
      address: '',
      address2: '',
      pincode: null,
      state: 'Delhi-NCR',
      city: '',
      files: [],
    };
    $scope.priceForm ={
      availabilities: [],
      to: new Date(),
      from: new Date(),
      rangeMode: false,
      priceweekday: '',
      priceweekend: '',
      deposit: '',
      vehicle: null,
      today: new Date(),
    };
    $scope.files1 = [];
    $scope.b = [];
  };
  $scope.postAddressCoordinates = function() {
    $scope.loadingIconShareNow=true;
    var fd = {
      lat: $scope.addressPicker.center[0],
      lon: $scope.addressPicker.center[1]
    };
    $http({
      method: 'PUT',
      url: URL_PREFIX + '/api/listing/address/' + $scope.listing.address.pk + '/',
      data: fd,
      headers: httpConfig
    }).
    then(function() {
        $scope.formLevel = 'Upload Documents';
        $scope.loadingIconShareNow=false;
    });
  };
  var gmap = NgMap.getMap();
  $scope.$on('mapInitialized', function(event, map) {
    map.setOptions({
    });
  });
  var userCurrentLocation = [28.613, 77.209];
  $scope.addressPicker = {
    initialCenter: userCurrentLocation,
    center: userCurrentLocation
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
  $scope.form ={
    maker: '',
    model: '',
    regNum: '',
    gear: 'Manual',
    year: '',
    kms: '',
    address: '',
    address2: '',
    pincode: null,
    state: 'Delhi-NCR',
    city: '',
    files: [],
  };
  $scope.priceForm = {
    availabilities: [],
    to: new Date(),
    from: new Date(),
    rangeMode: false,
    priceweekday: '',
    priceweekend: '',
    deposit: '',
    vehicle: null,
    today: new Date(),
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
      $scope.loadingIconShareNow=false;
    },function(error){
      $http({
        method: 'POST',
        url: URL_PREFIX + '/api/listing/availability/',
        data: data1,
        headers: {'Content-Type': 'application/json','Authorization': httpConfig.Authorization}
      }).
      then(function(response) {
        $scope.getReview();
      },function(error){
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
    }).then(function(response) {
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
    $scope.loadingIconShareNow=true;
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
    $scope.loadingIconShareNow=true;
    $scope.addressdata = {
      street: $scope.form.address + '\n' + $scope.form.address2,
      city: $scope.form.city,
      state: $scope.form.state,
      pincode: $scope.form.pincode
    };
    $http({
      method: 'POST',
      url: URL_PREFIX + '/api/listing/address/',
      data: $scope.addressdata,
      headers: httpConfig
    }).
    then(function(response) {
      $scope.addressObj = response.data;
      $scope.postListing();
      $scope.loadingIconShareNow=false;
    },function(error){
      if (error.status == 401) {
      $scope.loadingIconShareNow=false;
      $scope.toggleLoginForm();
        $mdToast.show(
          $mdToast.simple()
          .textContent('You need to be logged in for that! Please login!')
          .hideDelay(3000)
          .position('top right')
          );
        return;
      }
    });
  };
  $scope.postListing = function() {
    var dataToSend = {
      model: $scope.form.model.id,
      maker: $scope.form.model.maker.id,
      year: $scope.form.year,
      kms: $scope.form.kms,
      gearType: $scope.form.gear,
      regNum: $scope.form.regNum,
      address: $scope.addressObj.pk,
      };
    $http({
      method: 'POST',
      url: URL_PREFIX + '/api/listing/vehicle/',
      data: dataToSend,
      headers: httpConfig
    }).
    then(function(response) {
      $scope.priceForm.vehicle = response.data.id;
      $scope.listing = response.data;
      $scope.listing.availabilities = [];
      $scope.listing.media = [];
      $scope.listing.address = $scope.addressObj;
      $scope.formLevel = 'locate your car';
      gmap.then(function(map) {
        $scope.centerChanged = function(event) {
          $scope.addressPicker.center = [map.center.lat(), map.center.lng()];
        };
      });
    });
  };
  $scope.suggestCar = function(query) {
    if (typeof query == 'undefined') {
      query = '';
    }
    return $http.get(URL_PREFIX + '/api/listing/model/?car=' + query).
    then(function(response) {
        return response.data;
    });
  };
  $scope.goToTop = function() {
    $location.hash('top');
    $anchorScroll();
  };
  $scope.$watch('formLevel', function(oldValue, newValue) {
    $scope.goToTop();
  });
    // upload on file select or drop
  $scope.submitFiles = function(files) {
    $scope.uploadFiles(files);
    $scope.loadingIconShareNow=true;
  };
  $scope.files1 = [];
  $scope.confirmPhotos = function(files){
    $scope.files1 = $scope.files1.concat(files);
    $scope.files = [];
  };
  $scope.uploadFiles = function(files) {
    $scope.loadingIconShareNow=false;
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
    if ($scope.dp.length!= $scope.files1.length){
      for (var i=$scope.dp.length;i<$scope.files1.length;i++){
        $scope.dp[i] = 'normal';
      }
    }
    $scope.maxPhotos = 6;
    if (files.length > $scope.maxPhotos) {
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
        .textContent('Please select one photo to make it main photo.')
        .hideDelay(3000)
        .position('top right')
        );
      return "Error. Choose more than 5 files";
    }
    if ($scope.files1 && $scope.files1.length && files) {
      $scope.error = false;
      Upload.upload({
        url: URL_PREFIX + '/api/listing/media/',
        data: {
          attachment: $scope.files1,
          vehicle: $scope.listing.id,
          name: $scope.dp
        },
        headers: httpConfig
      }).
      then(function(response) {
        $scope.loadingIconShareNow=false;
        $scope.listing.media.push(response.data);
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
    $scope.formLevel = 'rent and availability';
  };
  $scope.dp = ['dp'];
  $scope.mainPhoto = function(files1, index) {
    $scope.dp[0] = 'dp';
    for (var i = 0; i < files1.length; i++) {
      $scope.dp[i] = 'normal';
    }
    $scope.dp[index] = 'dp';
  };
  $scope.eventSources = [];
  $scope.$watch('formLevel', function(newValue, oldValue) {
    $scope.goToTop();
    if (oldValue == 'basic information') {
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
    }
    else if (oldValue == 'locate your car') {
      $scope.postAddressCoordinates();
    }
    else if (oldValue == 'Upload Documents') {
      if($scope.files1.length===0){
        $scope.submitFiles($scope.test_files.files);
      }
    }
    else if (oldValue == 'rent and availability') {
      $scope.postPrice();
    }
    if (newValue=='review your listing'){
      $scope.getReview();
    }
  });
  $scope.indexPhoto = indexShare.getProperty();
  $scope.a = reviewCarImg.getProperty();
  $scope.nextPhoto =function (){
    if($scope.indexPhoto < $scope.a.media.length - 1){
      $scope.indexPhoto++;
    }
    else{
      $scope.indexPhoto = 0;
    }
  };
  $scope.prevPhoto =function (){
    if($scope.indexPhoto > 0){
      $scope.indexPhoto--;
    }else{
      $scope.indexPhoto = $scope.a.media.length - 1;
    }
  };
  $scope.imageDialogues = function(i) {
    indexShare.setProperty(i);
    reviewCarImg.setProperty($scope.reviewList);
    $mdDialog.show({
            templateUrl: 'templates/imagePopUp.html',
            parent: angular.element(document.body),
            controller: 'home.shareNow',
            clickOutsideToClose: true
        })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };
  $scope.checkfields=function(){
    var form2=$scope.form;
    var isnum=false;
    if(form2.year!==null){
      isnum = /^\d+$/.test(form2.year);
    }
    var yearinvalid=false,carsearchinvalid=false,regnuminvalid=false,locationinvalid=false,odometerinvalid=false,cityinvalid=false,pininvalid=false;
    var d=new Date();
    var n=d.getFullYear();
    var m=n-25;
    if(form2.city!==null){
      cityinvalid=!/^[A-z]+$/.test(form2.city);
    }
    else {
      cityinvalid=true;
    }
    if(form2.pincode!==null){
      pininvalid=!/^[0-9]{6,6}$/.test(form2.pincode);
    }
    else {
      pininvalid=true;
    }
    if (isnum===true){
      if(n-form2.year>=25){
        yearinvalid=true;
      }
    }
    else {
      yearinvalid=true;
    }
    if(form2.model===null){
      carsearchinvalid=true;
    }
    if(!$scope.place){
      locationinvalid=true;
    }
    if(form2.regNum!==null){
      regnuminvalid=!/^[a-zA-Z]{2}/.test(form2.regNum);
    }
    else {
      regnuminvalid=true;
    }
    if(form2.kms!==null){
      odometerinvalid=!/^(0|[1-9][0-9]*)$/.test(form2.kms);
    }
    else {
      odometerinvalid=true;
    }
    if(yearinvalid!==true && regnuminvalid!==true && locationinvalid!==true && carsearchinvalid!==true && odometerinvalid!==true && pininvalid!==true && cityinvalid!==true){
      $scope.postAddress();
    }
    else {
      if(carsearchinvalid===true){
        document.getElementsByTagName('md-autocomplete')[0].getElementsByTagName('md-input-container')[0].getElementsByTagName('input')[0].style.border='2px solid #dd2c00';
        document.getElementsByTagName('md-autocomplete')[0].getElementsByTagName('md-input-container')[0].getElementsByTagName('label')[0].innerHTML='Please select a car from the list';
        document.getElementsByTagName('md-autocomplete')[0].getElementsByTagName('md-input-container')[0].getElementsByTagName('label')[0].style.color="black";
      }
      else{
        document.getElementsByTagName('md-autocomplete')[0].getElementsByTagName('md-input-container')[0].getElementsByTagName('input')[0].style.border='none';
        document.getElementsByTagName('md-autocomplete')[0].getElementsByTagName('md-input-container')[0].getElementsByTagName('input')[0].style.borderBottom='1px solid #eee';
      }
      if(yearinvalid===true){
        document.getElementById('yearSelect').getElementsByTagName('input')[0].style.border='2px solid #dd2c00';
        console.log(document.getElementById('yearSelect'));
        document.getElementById('yearSelect').getElementsByTagName('label')[0].innerHTML="Please provide a valid year";
        document.getElementById('yearSelect').getElementsByTagName('label')[0].style.color="black";
      }
      else {
        document.getElementById('yearSelect').getElementsByTagName('input')[0].style.border='none';
      }
      if(locationinvalid===true){
        document.getElementById('locationselect').getElementsByTagName('input')[0].style.border='2px solid #dd2c00';
      }
      else {
        document.getElementById('locationselect').getElementsByTagName('input')[0].style.border='none';
      }
      if(regnuminvalid===true){
        document.getElementById('regnumSelect').getElementsByTagName('input')[0].style.border='2px solid #dd2c00';
        document.getElementById('regnumSelect').getElementsByTagName('label')[0].style.color="black";
      }
      else {
        document.getElementById('regnumSelect').getElementsByTagName('input')[0].style.border='none';
      }
      if(odometerinvalid===true){
        document.getElementById('odometerSelect').getElementsByTagName('input')[0].style.border='2px solid #dd2c00';
        document.getElementById('odometerSelect').getElementsByTagName('label')[0].style.color="black";
      }
      else {
        document.getElementById('odometerSelect').getElementsByTagName('input')[0].style.border='none';
      }
      if(pininvalid===true){
        document.getElementById('pinSelect').getElementsByTagName('input')[0].style.border='2px solid #dd2c00';
        document.getElementById('pinSelect').getElementsByTagName('label')[0].style.color="black";
      }
      else {
        document.getElementById('pinSelect').getElementsByTagName('input')[0].style.border='none';
      }
      if(cityinvalid===true){
        document.getElementById('citySelect').getElementsByTagName('input')[0].style.border='2px solid #dd2c00';
        document.getElementById('citySelect').getElementsByTagName('label')[0].style.color="black";
      }
      else {
        document.getElementById('citySelect').getElementsByTagName('input')[0].style.border='none';
      }
    }
  };
}]);
