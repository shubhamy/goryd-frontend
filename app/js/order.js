app.controller('order', ['$scope', '$http', function($scope, $http) {
    // $scope.bookingItem=[];
    httpConfig['Content-Type'] = 'application/json';

    $scope.bookingText = "";
    $scope.bookingCard = false;
    $scope.user_details = {
        name: "Santa Banta",
        rating: 3.5,
        age: 26,
        mobile: 9930467093,
        city: 'gwalior',
        profile_url: 'www.google.com',
        profile_pic_url: 'images/avatar04.png'
    };
    $scope.car_rent_details = {
        maker: "Audi",
        model: "R8 Spyder",
        car_pic: "images/FORD_FOCU_2012-1.png",
        pickup_time: "Feb 4, Friday, 11:30 AM",
        drop_time: "Feb 5, Friday, 11:30 AM",
        rent_hours: 467,
        total_rent: 6000,
        deposit: 2000,
        payment_mode: 0
    };
    // $http({
    //   method: 'GET',
    //   url: URL_PREFIX + '/api/listing/vehicle/?lat=28.5689165579&lon=77.1542346563'
    // }).
}]);
