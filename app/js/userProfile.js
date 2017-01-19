app.controller('userProfile', ['$scope', '$http', function($scope, $http) {
  httpConfig['Content-Type'] = 'application/json';
    $scope.profile = "";
    $scope.isReviews = true;
    $http({
        method: 'GET',
        url: URL_PREFIX + '/api/users/profile/?mode=self',
        headers: httpConfig
    }).then(function(response) {
        $scope.profile = response.data;
        $scope.isVerified = $scope.profile.isVerifiedRenter;
        $scope.dl = $scope.profile.dl;
        $scope.idProof = $scope.profile.idProof;
        if($scope.dl===null ||$scope.dl===undefined){
          $scope.dluploaded  =false;
        }else{
          $scope.dluploaded  =true;
        }
        if($scope.idProof===null ||$scope.idProof===undefined){
          $scope.iduploaded  =false;
        }else{
          $scope.iduploaded  =true;
        }
        $scope.username = $scope.profile.user.first_name + ' ' + $scope.profile.user.last_name;
        $scope.myRate = $scope.profile.rating;
        if($scope.profile.myReviews.length===0){
          $scope.isReviews=false;
        }
        $scope.userProfileImage = $scope.profile.dp;
        var index = 0;
        var value = 0;
        $scope.reviewerrating = function() {
            value = $scope.profile.myReviews[index].rating;
            index++;
            return value;
        };
    });
}]);
