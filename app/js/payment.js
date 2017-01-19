app.controller('payment', ['$scope', '$http', '$q', '$mdSidenav', '$stateParams','$mdToast','indexShare','$state', function($scope, $http, $q, $mdSidenav, $stateParams,$mdToast,indexShare,$state) {
  httpConfig['Content-Type'] = 'application/json';
  $scope.paymentOption="cod";
  $scope.booking = indexShare.getProperty();
  if($scope.booking===''){
    $state.go('accounts.requested');
  }
  $scope.totalPayment=  $scope.booking.deposit + $scope.booking.totalCost;
  $scope.taxApplicable = true;
  $scope.getNumber = function(num) {
    return new Array(num);
};
  var year=new Date();
  $scope.curryear=year.getFullYear();
  $scope.banks=['','State Bank of India','ICICI','UCO Bank'];
  $scope.getBanks=function(){
    return $scope.banks;
  };
}]);
