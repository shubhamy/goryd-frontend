app.controller('accounts.faq', ['$http', '$scope', '$location', '$anchorScroll','$mdToast', function($http, $scope, $location, $anchorScroll,$mdToast) {
  httpConfig['Content-Type'] = 'application/json';
    $location.hash('top');
    $anchorScroll();
    $scope.isSidenavOpen = false;
    $scope.faqs = {};
    $scope.subjects = {};
    $scope.showFaqs = showFaqs;
    $scope.QueAns = {};

    $http({
        method: 'GET',
        url: URL_PREFIX + '/api/support/faqs/',
    }).then(function(response) {
        updateDate(response.data);
        showFaqs(response.data[0].subject);
        $scope.subject_p = response.data[0].subject;
    },function(error){
      $mdToast.show(
        $mdToast.simple()
        .textContent("Oops, something is wrong!")
        .hideDelay(5000)
        .position('top right')
      );
    });
    $scope.selectedRow = 0; // initialize our variable to null
    $scope.setClickedRow = function(index) { //function that sets the value of selectedRow to current index
        $scope.selectedRow = index;
    };

    function updateDate(data) {
        for (var i in data) {
            $scope.subject_p = data[i].subject;
            question = data[i].question;
            answer = data[i].answer;
            if (angular.isUndefined($scope.faqs[$scope.subject_p])) {
                $scope.faqs[$scope.subject_p] = {};
                $scope.faqs[$scope.subject_p][question] = answer;
            } else {
                $scope.faqs[$scope.subject_p][question] = answer;
            }
        }
        $scope.subjects = Object.keys($scope.faqs);
    }

    function showFaqs(subject) {
        $scope.QueAns = $scope.faqs[subject];
        $scope.subject_p = subject;
    }
}]);
