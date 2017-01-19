app.directive('genericWizard', function() {
    return {
        templateUrl: 'templates/wizard.html',
        restrict: 'E',
        replace: true,
        scope: {
            currentStepVar: '=',
            stepList: '=',
            restrictMovemarker: '=',
            showNextprev: '='
        },
        controller: function($scope) {
            // $scope.stepList = JSON.parse($scope.stepList);
            $scope.nSteps = $scope.stepList.length;
            $scope.flagMarker = [];
            for (var i = 0; i < $scope.nSteps; i++) {
                $scope.flagMarker[i] = $scope.restrictMovemarker;
            }
            $scope.flagMarker[0] = true;
            $scope.currentStepIndex = 0;
            $scope.currentStepVar = $scope.stepList[$scope.currentStepIndex];
            $scope.$watch('currentStepVar', function(newValue, oldValue) {
                for (var i = 1; i < $scope.nSteps; i++) {
                    if ($scope.stepList[i] == newValue) {
                        $scope.currentStepIndex = i;
                        $scope.flagMarker[i] = true;
                        break;
                    }
                }
            });
            $scope.gotoNext = function() {
                if ($scope.currentStepVar != $scope.stepList[$scope.nSteps - 1]) {
                    $scope.currentStepIndex += 1;
                    $scope.currentStepVar = $scope.stepList[$scope.currentStepIndex];
                    $scope.flagMarker[$scope.currentStepIndex] = true;
                }
            };
            $scope.gotoPrev = function() {
                if ($scope.currentStepVar != $scope.stepList[0]) {
                    $scope.currentStepIndex -= 1;
                    $scope.currentStepVar = $scope.stepList[$scope.currentStepIndex];
                }
            };
            $scope.gotoStep = function(i) {
                $scope.currentStepVar = $scope.stepList[i];
                $scope.currentStepIndex = i;
            };
        },
    };
});
