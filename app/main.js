/**
 * @name mainApp
 * @description This is an entry point.
 */
 /*jshint esversion: 6 */

var app = angular.module('app', ['ngMaterial', 'ui.router', 'ngMap', 'ngCookies', 'ngMessages', 'ngFileUpload', 'ngMdIcons', 'material.svgAssetsCache', 'jkAngularRatingStars', 'materialCalendar', 'ngSanitize', 'ngAnimate']);


var URL_PREFIX = 'http://192.168.1.5:8000';
var httpConfig;
var LOGGED = false;
app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $sceDelegateProvider, $locationProvider) {
  // Below code has the ability to remove # from the urls
  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
  $httpProvider.defaults.headers.post = {
    'Content-Type': 'application/json'
  };
  $httpProvider.defaults.headers.put = {
    'Content-Type': 'application/json'
  };
  $urlRouterProvider.otherwise('/');
  $httpProvider.defaults.withCredentials = true;
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain. Notice the difference between * and **.
    URL_PREFIX,
  ]);
});

var SEARCH_LOCATION_COORDINATES = null;
var SEARCH_LOCATION = '';
var START_DATETIME = new Date(Date.now());
var END_DATETIME = new Date(Date.now() + 24 * 3600 * 1000);
var START_TIME = null;
var END_TIME = null;

app.config(function($stateProvider) {
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: 'templates/home.search.html',
      controller: 'home'
    });

  $stateProvider
    .state('list', {
      url: "/list",
      templateUrl: 'templates/home.list.html',
      controller: 'home.list'
    });

  $stateProvider
    .state('share', {
      url: "/share",
      templateUrl: 'templates/home.shareNow.html',
      controller: 'home.shareNow'
    });

  $stateProvider
    .state('editmyListing', {
      url: "/editmyListing",
      templateUrl: 'templates/editmyListing.html',
      controller: 'editmyListing'
    });

  $stateProvider
    .state('how-it-works', {
      url: "/how-it-works",
      templateUrl: 'templates/how-it-works.html'
    });

  $stateProvider
    .state('payment', {
      url: "/payment",
      templateUrl: 'templates/payment.html'
    });

  $stateProvider
    .state('bookingApproval', {
      url: "/bookingApproval",
      templateUrl: 'templates/bookingApproval.html',
      controller: 'order'
    });

  $stateProvider
    .state('userProfile', {
      url: "/userProfile",
      templateUrl: 'templates/userProfile.html'
    });

  $stateProvider
    .state('listnow', {
      url: "/share-your-car",
      templateUrl: 'templates/listnow.html'
    });

  $stateProvider
    .state('bookingConfirmed', {
      url: "/bookingConfirmed",
      templateUrl: 'templates/bookingConfirmed.html',
      controller: 'bookingconfirm'
    });

  $stateProvider
    .state('reviewOrder', {
      templateUrl: 'templates/reviewBooking.html',
      controller: 'reviewOrder'
    });

  $stateProvider
    .state('eligibility', {
      url: "/eligibility",
      templateUrl: 'templates/eligibility.html'
    });

  $stateProvider
    .state('privacy', {
      url: "/privacy",
      templateUrl: 'templates/privacy.html'
    });

  $stateProvider
    .state('renterPolicy', {
      url: "/renterPolicy",
      templateUrl: 'templates/renterPolicy.html'
    });

  $stateProvider
    .state('ownerPolicy', {
      url: "/ownerPolicy",
      templateUrl: 'templates/ownerPolicy.html'
    });

  $stateProvider
    .state('terms', {
      url: "/terms",
      templateUrl: 'templates/terms.html'
    });

  $stateProvider
    .state('aboutus', {
      url: "/aboutus",
      templateUrl: 'templates/aboutus.html'
    });

  $stateProvider
    .state('floatingButton', {
      templateUrl: 'templates/home.floatingButton.html',
      controller: 'floatingButton'
    });

  $stateProvider
    .state('accounts', {
      url: "/accounts",
      templateUrl: 'templates/accounts.html',
      controller: 'accounts'
    });

  $stateProvider
    .state('myListing', {
      url: "/myListing",
      templateUrl: 'templates/myListing.html',
      controller: 'myListing'
    });

  $stateProvider
    .state('faqs', {
      url: "/support/faqs",
      templateUrl: 'templates/faq.html',
      controller: 'accounts.faq'
    });

  $stateProvider
    .state('career', {
      url: "/career",
      templateUrl: "templates/career.html"
    });

  $stateProvider
    .state('paymentTerms', {
      url: "/payment-terms",
      templateUrl: "templates/payment-terms.html"
    });

});

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('indigo');
  $mdThemingProvider.theme('altTheme')
    .primaryPalette('grey')
    .accentPalette('blue');
  $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('grey')
    .dark();
});

app.run(function($rootScope, $state, $stateParams, $location, $anchorScroll, $http) {
  $rootScope.$state = $state;
  if (window.localStorage.jwtToken !== undefined) {
    $http({
      url: URL_PREFIX + '/api-token-refresh/',
      method: 'POST',
      data: {
        "token": window.localStorage.jwtToken
      },
      headers: httpConfig
    })
    .then(function(response) {
      window.localStorage.jwtToken = response.data.token;
      httpConfig = {
        'Authorization': 'JWT ' + window.localStorage.jwtToken,
        'Content-Type': 'application/json'
      };
    }, function(error) {
      if (error.data.non_field_errors[0] == "Signature has expired.") {
        window.localStorage.removeItem('jwtToken');
        httpConfig = {
          'Content-Type': 'application/json'
        };
      }
    });

    httpConfig = {
      'Authorization': 'JWT ' + window.localStorage.jwtToken,
      'Content-Type': 'application/json'
    };
  } else {
    httpConfig = {
      'Content-Type': 'application/json'
    };
  }

  $rootScope.$stateParams = $stateParams;
  $rootScope.$on("$stateChangeError", console.log.bind(console));
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (['home'].indexOf(toState.name) != -1) {
      $(".navbar-fixed-top").removeClass("top-nav-collapse");
      if (typeof $location != 'undefined') {
        $location.hash('top');
      }
    }
  });
});

app.directive('focusMe', function($timeout) {
  // bring any input into focus based on the focus-me = "true" attribute
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusMe, function(value) {
        if (value === true) {
          element[0].focus();
          scope[attrs.focusMe] = false;
        }
      });
    }
  };
});

app.directive('enterPress', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.enterPress);
        });
        event.preventDefault();
      }
    });
  };
});

app.directive('autoOpen', function() {
  const ENTER = 13;
  function compile(tElement) {
    tElement.find('input').attr('ng-click', 'ctrl.onClick($event)').next().remove();
    return function(scope, element, attrs, datePicker) {
      datePicker.onClick = function(event) {
        datePicker.openCalendarPane(event);
      };
      datePicker.ngInputElement.on('keypress', function(event) {
        if (event.keyCode === ENTER) {
          datePicker.openCalendarPane(event);
        }
      });
    };
  }

  return {
    compile: compile,
    priority: -1,
    require: 'mdDatepicker',
    restrict: 'A'
  };
});
