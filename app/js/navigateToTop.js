app.controller('navigateToTop', ['$scope', '$window', '$document', function($scope, $window, $document) {
  $scope.isPageScrolled = false;

  $window.onscroll = function () {
    if ($window.pageYOffset > 400) {
      $scope.isPageScrolled = true;
    } else {
      $scope.isPageScrolled = false;
    }
    $scope.$apply();
  };

  $scope.scrollToTop = function() {
    console.log("came here");
    $('body, html').animate({scrollTop: 0}, 700, 'easeInOutCubic');
  };

}]);
